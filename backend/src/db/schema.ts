import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const difficultyEnum = pgEnum("difficulty", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const quizModeEnum = pgEnum("quiz_mode", ["adaptive", "focused"]);

export const practiceModeEnum = pgEnum("practice_mode", [
  "endless",
  "timed",
  "mistakes",
  "weak_set",
]);

export const learningStatusEnum = pgEnum("learning_status", [
  "new",
  "learning",
  "reviewing",
  "mastered",
]);

// Candlestick Patterns Table
export const patterns = pgTable(
  "patterns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    difficulty: difficultyEnum("difficulty").notNull(),
    category: text("category").notNull(), // bullish, bearish, neutral
    meaning: text("meaning").notNull(),
    keyRules: jsonb("key_rules").$type<string[]>().notNull(), // Array of rules
    needsConfirmation: boolean("needs_confirmation").notNull().default(false),
    scenarios: jsonb("scenarios").$type<string[]>().notNull(), // Trading scenarios
    actionProtocol: text("action_protocol").notNull(), // What to do when pattern appears
    realWorldContext: text("real_world_context").notNull(),
    confusions: jsonb("confusions").$type<string[]>(), // Common confusions with other patterns
    candleSvgData: text("candle_svg_data"), // SVG representation of the pattern
    quickTest: jsonb("quick_test").$type<{
      question: string;
      options: string[];
      correctOptionIndex: number;
      explanation: string;
    }>(),
    exampleCharts: jsonb("example_charts").$type<
      Array<{
        type: "correct" | "incorrect" | "borderline";
        image: string; // Base64 or URL
        description: string;
      }>
    >(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("patterns_difficulty_idx").on(table.difficulty),
    index("patterns_category_idx").on(table.category),
  ]
);

// User Mastery Tracking Table
export const userMastery = pgTable(
  "user_mastery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    patternId: uuid("pattern_id").notNull().references(() => patterns.id, {
      onDelete: "cascade",
    }),
    masteryPercentage: decimal("mastery_percentage", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("0"),
    timesSeen: integer("times_seen").notNull().default(0),
    timesCorrect: integer("times_correct").notNull().default(0),
    timesIncorrect: integer("times_incorrect").notNull().default(0),
    lastSeenAt: timestamp("last_seen_at"),
    nextReviewAt: timestamp("next_review_at"),
    easeFactor: decimal("ease_factor", { precision: 4, scale: 2 })
      .notNull()
      .default("2.5"),
    intervalDays: integer("interval_days").notNull().default(1),
    streakDays: integer("streak_days").notNull().default(0),
    mistakeCount7days: integer("mistake_count_7days").notNull().default(0),
    learningStatus: learningStatusEnum("learning_status")
      .notNull()
      .default("new"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("user_mastery_user_id_idx").on(table.userId),
    index("user_mastery_pattern_id_idx").on(table.patternId),
    index("user_mastery_next_review_idx").on(table.nextReviewAt),
    index("user_mastery_learning_status_idx").on(table.learningStatus),
  ]
);

// Quiz Attempts Table
export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    patternId: uuid("pattern_id").notNull().references(() => patterns.id, {
      onDelete: "cascade",
    }),
    questionType: text("question_type").notNull(), // identify, property, scenario, etc.
    difficultyLevel: difficultyEnum("difficulty_level").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    timeTakenSeconds: integer("time_taken_seconds").notNull(),
    hintsUsed: integer("hints_used").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("quiz_attempts_user_id_idx").on(table.userId),
    index("quiz_attempts_pattern_id_idx").on(table.patternId),
    index("quiz_attempts_created_at_idx").on(table.createdAt),
  ]
);

// Practice Sessions Table
export const practiceSessions = pgTable(
  "practice_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    mode: practiceModeEnum("mode").notNull(),
    patternsAttempted: integer("patterns_attempted").notNull(),
    correctCount: integer("correct_count").notNull(),
    incorrectCount: integer("incorrect_count").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("practice_sessions_user_id_idx").on(table.userId),
    index("practice_sessions_created_at_idx").on(table.createdAt),
  ]
);

// User Stats Table
export const userStats = pgTable(
  "user_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().unique(),
    overallMasteryPercentage: decimal("overall_mastery_percentage", {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default("0"),
    currentStreakDays: integer("current_streak_days").notNull().default(0),
    longestStreakDays: integer("longest_streak_days").notNull().default(0),
    dailyGoalPatterns: integer("daily_goal_patterns").notNull().default(5),
    patternsToday: integer("patterns_today").notNull().default(0),
    lastActivityDate: timestamp("last_activity_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("user_stats_user_id_idx").on(table.userId)]
);

// Relations
export const patternsRelations = relations(patterns, ({ many }) => ({
  userMastery: many(userMastery),
  quizAttempts: many(quizAttempts),
}));

export const userMasteryRelations = relations(userMastery, ({ one }) => ({
  pattern: one(patterns, {
    fields: [userMastery.patternId],
    references: [patterns.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  pattern: one(patterns, {
    fields: [quizAttempts.patternId],
    references: [patterns.id],
  }),
}));
