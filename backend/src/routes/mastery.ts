import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, and, desc, gte, isNotNull } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // GET /mastery/overview - Get overall stats and problematic patterns
  fastify.get(
    "/mastery/overview",
    {
      schema: {
        description: "Get mastery overview stats",
        tags: ["mastery"],
        response: {
          200: { type: "object" },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // This would require authentication - for now return template
      return {
        overallMasteryPercentage: 0,
        currentStreakDays: 0,
        longestStreakDays: 0,
        totalPatternsLearned: 0,
        problematicPatterns: [],
      };
    }
  );

  // POST /mastery/update - Update mastery after quiz/practice
  fastify.post(
    "/mastery/update",
    {
      schema: {
        description: "Update mastery after quiz/practice attempt",
        tags: ["mastery"],
        body: {
          type: "object",
          properties: {
            userId: { type: "string" },
            patternId: { type: "string", format: "uuid" },
            isCorrect: { type: "boolean" },
            timeTakenSeconds: { type: "integer" },
          },
          required: ["userId", "patternId", "isCorrect", "timeTakenSeconds"],
        },
        response: {
          200: { type: "object" },
          400: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId, patternId, isCorrect, timeTakenSeconds } = request.body as {
        userId: string;
        patternId: string;
        isCorrect: boolean;
        timeTakenSeconds: number;
      };

      if (!userId || !patternId || typeof isCorrect !== "boolean" || !timeTakenSeconds) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      // Check if pattern exists
      const pattern = await app.db.query.patterns.findFirst({
        where: eq(schema.patterns.id, patternId),
      });

      if (!pattern) {
        return reply.status(400).send({ error: "Pattern not found" });
      }

      // Find or create user mastery record
      let userMasteryRecord = await app.db.query.userMastery.findFirst({
        where: and(
          eq(schema.userMastery.userId, userId),
          eq(schema.userMastery.patternId, patternId)
        ),
      });

      const now = new Date();
      let newEaseFactor: number;
      let newIntervalDays: number;
      let newNextReviewAt: Date;
      let newStreakDays: number;
      let newMistakeCount7days: number;

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
            intervalDays: isCorrect ? 1 : 1,
            nextReviewAt: new Date(now.getTime() + (isCorrect ? 86400000 : 86400000)),
            learningStatus: isCorrect ? "learning" : "new",
            streakDays: isCorrect ? 1 : 0,
            mistakeCount7days: isCorrect ? 0 : 1,
          })
          .returning();

        userMasteryRecord = created;
      } else {
        // Update existing record with spaced repetition logic
        const currentEaseFactor = parseFloat(userMasteryRecord.easeFactor as any);
        const currentIntervalDays = userMasteryRecord.intervalDays;
        const currentTimesSeen = userMasteryRecord.timesSeen;
        const currentTimesCorrect = userMasteryRecord.timesCorrect;
        const currentTimesIncorrect = userMasteryRecord.timesIncorrect;

        if (isCorrect) {
          // Increase interval and ease factor
          newEaseFactor = currentEaseFactor + 0.1;
          newIntervalDays = Math.ceil(currentIntervalDays * newEaseFactor);
          newNextReviewAt = new Date(now.getTime() + newIntervalDays * 86400000);
          newStreakDays = (userMasteryRecord.streakDays || 0) + 1;
          newMistakeCount7days = Math.max(0, (userMasteryRecord.mistakeCount7days || 0) - 1);
        } else {
          // Reset interval and decrease ease factor
          newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
          newIntervalDays = 1;
          newNextReviewAt = new Date(now.getTime() + 86400000);
          newStreakDays = 0;
          newMistakeCount7days = (userMasteryRecord.mistakeCount7days || 0) + 1;
        }

        // Calculate new mastery percentage (rolling average of last 10)
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

        // Update the record
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

      // Update or create user stats
      let userStats = await app.db.query.userStats.findFirst({
        where: eq(schema.userStats.userId, userId),
      });

      if (!userStats) {
        const [created] = await app.db
          .insert(schema.userStats)
          .values({
            userId,
            overallMasteryPercentage: "0",
            currentStreakDays: 0,
            longestStreakDays: 0,
            patternsToday: 1,
            lastActivityDate: now,
          })
          .returning();

        userStats = created;
      } else {
        // Update stats
        const [updated] = await app.db
          .update(schema.userStats)
          .set({
            patternsToday: (userStats.patternsToday || 0) + 1,
            lastActivityDate: now,
          })
          .where(eq(schema.userStats.userId, userId))
          .returning();

        userStats = updated;
      }

      return {
        success: true,
        mastery: userMasteryRecord,
        stats: userStats,
      };
    }
  );

  // GET /mastery/pattern/:patternId - Get detailed mastery for specific pattern
  fastify.get(
    "/mastery/pattern/:patternId",
    {
      schema: {
        description: "Get detailed mastery for specific pattern",
        tags: ["mastery"],
        params: {
          type: "object",
          properties: {
            patternId: { type: "string", format: "uuid" },
          },
          required: ["patternId"],
        },
        response: {
          200: { type: "object" },
          404: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { patternId } = request.params as { patternId: string };

      const mastery = await app.db.query.userMastery.findFirst({
        where: eq(schema.userMastery.patternId, patternId),
        with: {
          pattern: true,
        },
      });

      if (!mastery) {
        return reply.status(404).send({ error: "Mastery record not found" });
      }

      return mastery;
    }
  );
}
