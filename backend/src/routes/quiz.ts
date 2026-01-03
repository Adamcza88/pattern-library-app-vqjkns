import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, and, inArray } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // GET /quiz/generate - Generate quiz questions
  fastify.get(
    "/quiz/generate",
    {
      schema: {
        description: "Generate quiz questions",
        tags: ["quiz"],
        querystring: {
          type: "object",
          properties: {
            difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
            mode: { type: "string", enum: ["adaptive", "focused"], default: "adaptive" },
            count: { type: "integer", default: 5, minimum: 1, maximum: 20 },
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
      const { difficulty, mode = "adaptive", count = 5, userId } = request.query as {
        difficulty?: string;
        mode?: string;
        count?: number;
        userId: string;
      };

      if (!userId) {
        return reply.status(400).send({ error: "userId is required" });
      }

      // Apply difficulty filter if specified
      let patterns: typeof schema.patterns.$inferSelect[];
      if (difficulty) {
        patterns = await app.db
          .select()
          .from(schema.patterns)
          .where(eq(schema.patterns.difficulty, difficulty as any))
          .limit(count);
      } else {
        patterns = await app.db.select().from(schema.patterns).limit(count);
      }

      // Generate quiz questions from patterns
      const questions = patterns.map((pattern) => {
        const quickTest = pattern.quickTest as any;

        return {
          patternId: pattern.id,
          patternName: pattern.name,
          questionType: "pattern_identification",
          question:
            quickTest?.question || `Identify the candlestick pattern "${pattern.name}"`,
          options: quickTest?.options || ["Option A", "Option B", "Option C", "Option D"],
          difficulty: pattern.difficulty,
          mode: mode,
        };
      });

      return questions;
    }
  );

  // POST /quiz/submit - Submit quiz answer
  fastify.post(
    "/quiz/submit",
    {
      schema: {
        description: "Submit quiz answer and get feedback",
        tags: ["quiz"],
        body: {
          type: "object",
          properties: {
            userId: { type: "string" },
            patternId: { type: "string", format: "uuid" },
            questionType: { type: "string" },
            difficultyLevel: { type: "string" },
            selectedAnswer: { type: "integer" },
            timeTakenSeconds: { type: "integer" },
            hintsUsed: { type: "integer", default: 0 },
          },
          required: [
            "userId",
            "patternId",
            "questionType",
            "difficultyLevel",
            "selectedAnswer",
            "timeTakenSeconds",
          ],
        },
        response: {
          200: { type: "object" },
          400: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        userId,
        patternId,
        questionType,
        difficultyLevel,
        selectedAnswer,
        timeTakenSeconds,
        hintsUsed = 0,
      } = request.body as {
        userId: string;
        patternId: string;
        questionType: string;
        difficultyLevel: string;
        selectedAnswer: number;
        timeTakenSeconds: number;
        hintsUsed?: number;
      };

      // Validation
      if (
        !userId ||
        !patternId ||
        !questionType ||
        !difficultyLevel ||
        selectedAnswer === undefined ||
        !timeTakenSeconds
      ) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      // Get pattern and check correct answer
      const pattern = await app.db.query.patterns.findFirst({
        where: eq(schema.patterns.id, patternId),
      });

      if (!pattern) {
        return reply.status(400).send({ error: "Pattern not found" });
      }

      // Check if answer is correct
      const quickTest = pattern.quickTest as any;
      const isCorrect = quickTest?.correctOptionIndex === selectedAnswer;

      // Record quiz attempt
      const [attempt] = await app.db
        .insert(schema.quizAttempts)
        .values({
          userId,
          patternId,
          questionType,
          difficultyLevel: difficultyLevel as any,
          isCorrect,
          timeTakenSeconds,
          hintsUsed,
        })
        .returning();

      // Get explanation
      const explanation = quickTest?.explanation || "No explanation available";

      return {
        success: true,
        isCorrect,
        explanation,
        correctOptionIndex: quickTest?.correctOptionIndex,
        attempt,
      };
    }
  );

  // GET /quiz/difficulty-info - Get difficulty level information
  fastify.get(
    "/quiz/difficulty-info",
    {
      schema: {
        description: "Get information about difficulty levels",
        tags: ["quiz"],
        response: {
          200: {
            type: "object",
            properties: {
              beginner: { type: "object" },
              intermediate: { type: "object" },
              advanced: { type: "object" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        beginner: {
          level: "Beginner",
          description: "Tests basic pattern recognition and fundamental characteristics",
          exampleQuestions: [
            "Identify the basic shape of this pattern",
            "Which direction does this pattern suggest?",
            "How many candles form this pattern?",
          ],
          timeLimit: 60,
          passPercentage: 70,
        },
        intermediate: {
          level: "Intermediate",
          description: "Tests deeper understanding of pattern rules and applications",
          exampleQuestions: [
            "What confirmations would strengthen this pattern?",
            "In which market conditions does this pattern work best?",
            "How would you trade this pattern?",
          ],
          timeLimit: 120,
          passPercentage: 75,
        },
        advanced: {
          level: "Advanced",
          description: "Tests mastery of pattern nuances, trade management, and edge cases",
          exampleQuestions: [
            "Distinguish between this and similar patterns",
            "How would you filter false signals?",
            "What are the risk management implications?",
          ],
          timeLimit: 180,
          passPercentage: 80,
        },
      };
    }
  );
}
