import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, desc, asc, and, or, gte, lte, lt, isNotNull, sql, gt } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // GET /patterns - List all patterns with filters
  fastify.get(
    "/patterns",
    {
      schema: {
        description: "List all patterns with optional filters",
        tags: ["patterns"],
        querystring: {
          type: "object",
          properties: {
            difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
            masteryStatus: { type: "string", enum: ["new", "learning", "reviewing", "mastered"] },
            category: { type: "string" },
            search: { type: "string" },
            confusablePairs: { type: "boolean" },
            mistakesLast7days: { type: "boolean" },
            limit: { type: "integer", default: 50 },
            offset: { type: "integer", default: 0 },
          },
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
      const {
        difficulty,
        masteryStatus,
        category,
        search,
        confusablePairs,
        mistakesLast7days,
        limit = 50,
        offset = 0,
      } = request.query as {
        difficulty?: string;
        masteryStatus?: string;
        category?: string;
        search?: string;
        confusablePairs?: boolean;
        mistakesLast7days?: boolean;
        limit?: number;
        offset?: number;
      };

      const conditions: any[] = [];

      if (difficulty) {
        conditions.push(eq(schema.patterns.difficulty, difficulty as any));
      }

      if (category) {
        conditions.push(eq(schema.patterns.category, category));
      }

      if (search) {
        conditions.push(
          or(
            sql`${schema.patterns.name} ILIKE ${`%${search}%`}`,
            sql`${schema.patterns.meaning} ILIKE ${`%${search}%`}`
          )
        );
      }

      if (confusablePairs) {
        conditions.push(isNotNull(schema.patterns.confusions));
      }

      let patterns;
      if (conditions.length > 0) {
        patterns = await app.db
          .select()
          .from(schema.patterns)
          .where(and(...conditions))
          .limit(limit)
          .offset(offset);
      } else {
        patterns = await app.db.select().from(schema.patterns).limit(limit).offset(offset);
      }

      // Apply mastery status filter if provided (requires user info - would need auth)
      if (masteryStatus) {
        // This would require authentication context
        // For now, return unfiltered patterns
      }

      // Apply mistakes filter if provided
      if (mistakesLast7days) {
        // This would require user context from auth
        // For now, return unfiltered patterns
      }

      return patterns;
    }
  );

  // GET /patterns/:id - Get full pattern details with user mastery data
  fastify.get(
    "/patterns/:id",
    {
      schema: {
        description: "Get full pattern details",
        tags: ["patterns"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        response: {
          200: { type: "object" },
          404: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const pattern = await app.db.query.patterns.findFirst({
        where: eq(schema.patterns.id, id),
        with: {
          userMastery: true,
        },
      });

      if (!pattern) {
        return reply.status(404).send({ error: "Pattern not found" });
      }

      return pattern;
    }
  );

  // GET /patterns/learning-path - Get patterns ordered by difficulty and mastery level
  fastify.get(
    "/patterns/learning-path",
    {
      schema: {
        description: "Get learning path with patterns ordered by difficulty",
        tags: ["patterns"],
        response: {
          200: {
            type: "array",
            items: { type: "object" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const patterns = await app.db
        .select()
        .from(schema.patterns)
        .orderBy(
          asc(
            sql`CASE
              WHEN ${schema.patterns.difficulty} = 'beginner' THEN 0
              WHEN ${schema.patterns.difficulty} = 'intermediate' THEN 1
              ELSE 2
            END`
          )
        );

      return patterns;
    }
  );

  // GET /patterns/review-queue - Get patterns due for spaced repetition review
  fastify.get(
    "/patterns/review-queue",
    {
      schema: {
        description: "Get patterns due for spaced repetition review",
        tags: ["patterns"],
        response: {
          200: {
            type: "array",
            items: { type: "object" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const now = new Date();

      // Get patterns with mastery records where next review is due
      const reviewQueue = await app.db
        .select({
          pattern: schema.patterns,
          mastery: schema.userMastery,
        })
        .from(schema.patterns)
        .innerJoin(
          schema.userMastery,
          eq(schema.patterns.id, schema.userMastery.patternId)
        )
        .where(lte(schema.userMastery.nextReviewAt, now))
        .orderBy(desc(schema.userMastery.nextReviewAt))
        .limit(20);

      return reviewQueue.map((row) => ({
        ...row.pattern,
        mastery: row.mastery,
      }));
    }
  );

  // GET /patterns/problematic - Get top 5 most problematic patterns
  fastify.get(
    "/patterns/problematic",
    {
      schema: {
        description: "Get top 5 most problematic patterns",
        tags: ["patterns"],
        response: {
          200: {
            type: "array",
            items: { type: "object" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const problematicPatterns = await app.db
        .select({
          pattern: schema.patterns,
          mistakeCount: schema.userMastery.mistakeCount7days,
          masteryPercentage: schema.userMastery.masteryPercentage,
        })
        .from(schema.patterns)
        .innerJoin(
          schema.userMastery,
          eq(schema.patterns.id, schema.userMastery.patternId)
        )
        .where(gt(schema.userMastery.mistakeCount7days, 0))
        .orderBy(desc(schema.userMastery.mistakeCount7days))
        .limit(5);

      return problematicPatterns.map((row) => ({
        ...row.pattern,
        mistakeCount: row.mistakeCount,
        masteryPercentage: row.masteryPercentage,
      }));
    }
  );
}
