import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, and, isNull } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // GET /practice/generate - Generate practice set
  fastify.get(
    "/practice/generate",
    {
      schema: {
        description: "Generate practice set",
        tags: ["practice"],
        querystring: {
          type: "object",
          properties: {
            mode: {
              type: "string",
              enum: ["endless", "timed", "mistakes", "weak_set"],
              default: "endless",
            },
            count: { type: "integer", default: 10, minimum: 1, maximum: 50 },
            userId: { type: "string" },
          },
          required: ["userId"],
        },
        response: {
          200: {
            type: "array",
            items: { type: "object" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { mode = "endless", count = 10, userId } = request.query as {
        mode?: string;
        count?: number;
        userId: string;
      };

      if (!userId) {
        return reply.status(400).send({ error: "userId is required" });
      }

      let patternsQuery = app.db.select().from(schema.patterns);

      // Select patterns based on mode
      if (mode === "weak_set") {
        // Get patterns with low mastery
        const weakPatterns = await app.db
          .select({
            pattern: schema.patterns,
            masteryPercentage: schema.userMastery.masteryPercentage,
          })
          .from(schema.patterns)
          .leftJoin(
            schema.userMastery,
            and(
              eq(schema.patterns.id, schema.userMastery.patternId),
              eq(schema.userMastery.userId, userId)
            )
          )
          .limit(count);

        return weakPatterns.map((item) => ({
          ...item.pattern,
          masteryPercentage: item.masteryPercentage,
        }));
      } else if (mode === "mistakes") {
        // Get patterns with recent mistakes
        const mistakePatterns = await app.db
          .select({
            pattern: schema.patterns,
            mistakeCount: schema.userMastery.mistakeCount7days,
          })
          .from(schema.patterns)
          .leftJoin(
            schema.userMastery,
            and(
              eq(schema.patterns.id, schema.userMastery.patternId),
              eq(schema.userMastery.userId, userId)
            )
          )
          .limit(count);

        return mistakePatterns.map((item) => ({
          ...item.pattern,
          mistakeCount: item.mistakeCount,
        }));
      } else {
        // endless or timed: return random patterns
        const patterns = await patternsQuery.limit(count);
        return patterns;
      }
    }
  );

  // POST /practice/submit - Submit practice answer
  fastify.post(
    "/practice/submit",
    {
      schema: {
        description: "Submit practice answer and update mastery",
        tags: ["practice"],
        body: {
          type: "object",
          properties: {
            userId: { type: "string" },
            patternId: { type: "string", format: "uuid" },
            selectedAnswer: { type: "integer" },
            timeTakenSeconds: { type: "integer" },
          },
          required: ["userId", "patternId", "selectedAnswer", "timeTakenSeconds"],
        },
        response: {
          200: { type: "object" },
          400: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId, patternId, selectedAnswer, timeTakenSeconds } = request.body as {
        userId: string;
        patternId: string;
        selectedAnswer: number;
        timeTakenSeconds: number;
      };

      if (!userId || !patternId || selectedAnswer === undefined || !timeTakenSeconds) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      // Get pattern
      const pattern = await app.db.query.patterns.findFirst({
        where: eq(schema.patterns.id, patternId),
      });

      if (!pattern) {
        return reply.status(400).send({ error: "Pattern not found" });
      }

      // Check if answer is correct
      const quickTest = pattern.quickTest as any;
      const isCorrect = quickTest?.correctOptionIndex === selectedAnswer;

      // Get or create user mastery record
      let userMasteryRecord = await app.db.query.userMastery.findFirst({
        where: and(
          eq(schema.userMastery.userId, userId),
          eq(schema.userMastery.patternId, patternId)
        ),
      });

      const now = new Date();

      if (!userMasteryRecord) {
        // Create new mastery record
        const [created] = await app.db
          .insert(schema.userMastery)
          .values({
            userId,
            patternId,
            timesSeen: 1,
            timesCorrect: isCorrect ? 1 : 0,
            timesIncorrect: isCorrect ? 0 : 1,
            masteryPercentage: isCorrect ? "100" : "0",
            lastSeenAt: now,
            easeFactor: isCorrect ? "2.5" : "1.3",
            intervalDays: 1,
            nextReviewAt: new Date(now.getTime() + 86400000),
            learningStatus: isCorrect ? "learning" : "new",
            streakDays: isCorrect ? 1 : 0,
            mistakeCount7days: isCorrect ? 0 : 1,
          })
          .returning();

        userMasteryRecord = created;
      } else {
        // Update existing record
        const currentEaseFactor = parseFloat(userMasteryRecord.easeFactor as any);
        const currentIntervalDays = userMasteryRecord.intervalDays;
        const currentTimesSeen = userMasteryRecord.timesSeen;
        const currentTimesCorrect = userMasteryRecord.timesCorrect;
        const currentTimesIncorrect = userMasteryRecord.timesIncorrect;

        let newEaseFactor: number;
        let newIntervalDays: number;
        let newNextReviewAt: Date;
        let newStreakDays: number;
        let newMistakeCount7days: number;

        if (isCorrect) {
          newEaseFactor = currentEaseFactor + 0.1;
          newIntervalDays = Math.ceil(currentIntervalDays * newEaseFactor);
          newNextReviewAt = new Date(now.getTime() + newIntervalDays * 86400000);
          newStreakDays = (userMasteryRecord.streakDays || 0) + 1;
          newMistakeCount7days = Math.max(0, (userMasteryRecord.mistakeCount7days || 0) - 1);
        } else {
          newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
          newIntervalDays = 1;
          newNextReviewAt = new Date(now.getTime() + 86400000);
          newStreakDays = 0;
          newMistakeCount7days = (userMasteryRecord.mistakeCount7days || 0) + 1;
        }

        // Calculate new mastery percentage
        const totalAttempts = currentTimesSeen + 1;
        const newTimesCorrect = currentTimesCorrect + (isCorrect ? 1 : 0);
        const newMasteryPercentage =
          totalAttempts <= 10
            ? (newTimesCorrect / totalAttempts) * 100
            : (newTimesCorrect / 10) * 100;

        // Determine learning status
        let newLearningStatus = userMasteryRecord.learningStatus;
        if (newMasteryPercentage >= 85) {
          newLearningStatus = "mastered";
        } else if (newMasteryPercentage >= 60) {
          newLearningStatus = "reviewing";
        } else if (newMasteryPercentage >= 30) {
          newLearningStatus = "learning";
        } else {
          newLearningStatus = "new";
        }

        const [updated] = await app.db
          .update(schema.userMastery)
          .set({
            timesSeen: currentTimesSeen + 1,
            timesCorrect: newTimesCorrect,
            timesIncorrect: currentTimesIncorrect + (isCorrect ? 0 : 1),
            masteryPercentage: newMasteryPercentage.toString(),
            lastSeenAt: now,
            easeFactor: newEaseFactor.toString(),
            intervalDays: newIntervalDays,
            nextReviewAt: newNextReviewAt,
            streakDays: newStreakDays,
            mistakeCount7days: newMistakeCount7days,
            learningStatus: newLearningStatus as any,
          })
          .where(eq(schema.userMastery.id, userMasteryRecord.id))
          .returning();

        userMasteryRecord = updated;
      }

      return {
        success: true,
        isCorrect,
        explanation: quickTest?.explanation || "No explanation available",
        mastery: userMasteryRecord,
      };
    }
  );

  // POST /practice/session - Save practice session stats
  fastify.post(
    "/practice/session",
    {
      schema: {
        description: "Save practice session statistics",
        tags: ["practice"],
        body: {
          type: "object",
          properties: {
            userId: { type: "string" },
            mode: { type: "string", enum: ["endless", "timed", "mistakes", "weak_set"] },
            patternsAttempted: { type: "integer" },
            correctCount: { type: "integer" },
            incorrectCount: { type: "integer" },
            durationSeconds: { type: "integer" },
          },
          required: [
            "userId",
            "mode",
            "patternsAttempted",
            "correctCount",
            "incorrectCount",
            "durationSeconds",
          ],
        },
        response: {
          200: { type: "object" },
          400: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId, mode, patternsAttempted, correctCount, incorrectCount, durationSeconds } =
        request.body as {
          userId: string;
          mode: string;
          patternsAttempted: number;
          correctCount: number;
          incorrectCount: number;
          durationSeconds: number;
        };

      if (
        !userId ||
        !mode ||
        patternsAttempted === undefined ||
        correctCount === undefined ||
        incorrectCount === undefined ||
        durationSeconds === undefined
      ) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      // Validate mode
      const validModes = ["endless", "timed", "mistakes", "weak_set"];
      if (!validModes.includes(mode)) {
        return reply.status(400).send({ error: "Invalid practice mode" });
      }

      // Create practice session
      const [session] = await app.db
        .insert(schema.practiceSessions)
        .values({
          userId,
          mode: mode as any,
          patternsAttempted,
          correctCount,
          incorrectCount,
          durationSeconds,
        })
        .returning();

      return {
        success: true,
        session,
      };
    }
  );
}
