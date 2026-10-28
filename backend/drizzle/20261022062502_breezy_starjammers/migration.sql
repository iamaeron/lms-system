CREATE TYPE "classroom_role" AS ENUM('teacher', 'student');--> statement-breakpoint
CREATE TYPE "course_level" AS ENUM('minor', 'major');--> statement-breakpoint
CREATE TYPE "course_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "lesson_type" AS ENUM('video', 'text', 'quiz', 'assignment');--> statement-breakpoint
CREATE TYPE "question_type" AS ENUM('single_choice', 'multiple_choice', 'true_false');--> statement-breakpoint
CREATE TYPE "submission_status" AS ENUM('submitted', 'graded', 'returned');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignment" (
	"id" text PRIMARY KEY,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"instructions" text,
	"max_points" integer DEFAULT 100 NOT NULL,
	"due_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "classroom" (
	"id" text PRIMARY KEY,
	"course_id" text NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"join_code" text NOT NULL UNIQUE,
	"join_enabled" boolean DEFAULT true NOT NULL,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_member" (
	"id" text PRIMARY KEY,
	"classroom_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "classroom_role" DEFAULT 'student'::"classroom_role" NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"summary" text,
	"description" text,
	"thumbnail_url" text,
	"level" "course_level" DEFAULT 'major'::"course_level" NOT NULL,
	"grade_level" integer,
	"status" "course_status" DEFAULT 'draft'::"course_status" NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"published_at" timestamp,
	"instructor_id" text NOT NULL,
	"category_id" text,
	"department_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "department" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"code" text UNIQUE,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "lesson" (
	"id" text PRIMARY KEY,
	"section_id" text NOT NULL,
	"title" text NOT NULL,
	"type" "lesson_type" DEFAULT 'video'::"lesson_type" NOT NULL,
	"content" text,
	"video_url" text,
	"duration_seconds" integer,
	"position" integer NOT NULL,
	"is_preview" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"last_position_seconds" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY,
	"quiz_id" text NOT NULL,
	"type" "question_type" DEFAULT 'single_choice'::"question_type" NOT NULL,
	"prompt" text NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_option" (
	"id" text PRIMARY KEY,
	"question_id" text NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" text PRIMARY KEY,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"passing_score" integer DEFAULT 70 NOT NULL,
	"max_attempts" integer,
	"time_limit_minutes" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempt" (
	"id" text PRIMARY KEY,
	"quiz_id" text NOT NULL,
	"user_id" text NOT NULL,
	"answers" jsonb,
	"score" integer,
	"passed" boolean,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" text PRIMARY KEY,
	"course_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "section" (
	"id" text PRIMARY KEY,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" text PRIMARY KEY,
	"assignment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text,
	"file_url" text,
	"status" "submission_status" DEFAULT 'submitted'::"submission_status" NOT NULL,
	"grade" integer,
	"feedback" text,
	"graded_by" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"graded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "assignment_lesson_idx" ON "assignment" ("lesson_id");--> statement-breakpoint
CREATE INDEX "classroom_course_idx" ON "classroom" ("course_id");--> statement-breakpoint
CREATE INDEX "classroom_owner_idx" ON "classroom" ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "classroom_member_uidx" ON "classroom_member" ("classroom_id","user_id");--> statement-breakpoint
CREATE INDEX "classroom_member_user_idx" ON "classroom_member" ("user_id");--> statement-breakpoint
CREATE INDEX "course_instructor_idx" ON "course" ("instructor_id");--> statement-breakpoint
CREATE INDEX "course_category_idx" ON "course" ("category_id");--> statement-breakpoint
CREATE INDEX "course_department_idx" ON "course" ("department_id");--> statement-breakpoint
CREATE INDEX "course_grade_level_idx" ON "course" ("grade_level");--> statement-breakpoint
CREATE INDEX "lesson_section_idx" ON "lesson" ("section_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_progress_user_lesson_uidx" ON "lesson_progress" ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX "question_quiz_idx" ON "question" ("quiz_id");--> statement-breakpoint
CREATE INDEX "question_option_question_idx" ON "question_option" ("question_id");--> statement-breakpoint
CREATE INDEX "quiz_lesson_idx" ON "quiz" ("lesson_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_quiz_user_idx" ON "quiz_attempt" ("quiz_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "review_course_user_uidx" ON "review" ("course_id","user_id");--> statement-breakpoint
CREATE INDEX "section_course_idx" ON "section" ("course_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_assignment_user_uidx" ON "submission" ("assignment_id","user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_lesson_id_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_course_id_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_owner_id_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_classroom_id_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_instructor_id_user_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "user"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_department_id_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_section_id_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_quiz_id_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question_option" ADD CONSTRAINT "question_option_question_id_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_lesson_id_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_quiz_id_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_course_id_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "section" ADD CONSTRAINT "section_course_id_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_assignment_id_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_graded_by_user_id_fkey" FOREIGN KEY ("graded_by") REFERENCES "user"("id") ON DELETE SET NULL;