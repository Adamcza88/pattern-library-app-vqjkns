CREATE TYPE "public"."difficulty" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."learning_status" AS ENUM('new', 'learning', 'reviewing', 'mastered');--> statement-breakpoint
CREATE TYPE "public"."practice_mode" AS ENUM('endless', 'timed', 'mistakes', 'weak_set');--> statement-breakpoint
CREATE TYPE "public"."quiz_mode" AS ENUM('adaptive', 'focused');--> statement-breakpoint
CREATE TABLE "patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"category" text NOT NULL,
	"meaning" text NOT NULL,
	"key_rules" jsonb NOT NULL,
	"needs_confirmation" boolean DEFAULT false NOT NULL,
	"scenarios" jsonb NOT NULL,
	"action_protocol" text NOT NULL,
	"real_world_context" text NOT NULL,
	"confusions" jsonb,
	"candle_svg_data" text,
	"quick_test" jsonb,
	"example_charts" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patterns_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "practice_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"mode" "practice_mode" NOT NULL,
	"patterns_attempted" integer NOT NULL,
	"correct_count" integer NOT NULL,
	"incorrect_count" integer NOT NULL,
	"duration_seconds" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"pattern_id" uuid NOT NULL,
	"question_type" text NOT NULL,
	"difficulty_level" "difficulty" NOT NULL,
	"is_correct" boolean NOT NULL,
	"time_taken_seconds" integer NOT NULL,
	"hints_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_mastery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"pattern_id" uuid NOT NULL,
	"mastery_percentage" numeric(5, 2) DEFAULT '0' NOT NULL,
	"times_seen" integer DEFAULT 0 NOT NULL,
	"times_correct" integer DEFAULT 0 NOT NULL,
	"times_incorrect" integer DEFAULT 0 NOT NULL,
	"last_seen_at" timestamp,
	"next_review_at" timestamp,
	"ease_factor" numeric(4, 2) DEFAULT '2.5' NOT NULL,
	"interval_days" integer DEFAULT 1 NOT NULL,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"mistake_count_7days" integer DEFAULT 0 NOT NULL,
	"learning_status" "learning_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"overall_mastery_percentage" numeric(5, 2) DEFAULT '0' NOT NULL,
	"current_streak_days" integer DEFAULT 0 NOT NULL,
	"longest_streak_days" integer DEFAULT 0 NOT NULL,
	"daily_goal_patterns" integer DEFAULT 5 NOT NULL,
	"patterns_today" integer DEFAULT 0 NOT NULL,
	"last_activity_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_pattern_id_patterns_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."patterns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mastery" ADD CONSTRAINT "user_mastery_pattern_id_patterns_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."patterns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "patterns_difficulty_idx" ON "patterns" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "patterns_category_idx" ON "patterns" USING btree ("category");--> statement-breakpoint
CREATE INDEX "practice_sessions_user_id_idx" ON "practice_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "practice_sessions_created_at_idx" ON "practice_sessions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "quiz_attempts_user_id_idx" ON "quiz_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_pattern_id_idx" ON "quiz_attempts" USING btree ("pattern_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_created_at_idx" ON "quiz_attempts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_mastery_user_id_idx" ON "user_mastery" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_mastery_pattern_id_idx" ON "user_mastery" USING btree ("pattern_id");--> statement-breakpoint
CREATE INDEX "user_mastery_next_review_idx" ON "user_mastery" USING btree ("next_review_at");--> statement-breakpoint
CREATE INDEX "user_mastery_learning_status_idx" ON "user_mastery" USING btree ("learning_status");--> statement-breakpoint
CREATE INDEX "user_stats_user_id_idx" ON "user_stats" USING btree ("user_id");