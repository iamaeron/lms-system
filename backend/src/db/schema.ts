import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { customAlphabet, nanoid } from "nanoid";

export const userRole = pgEnum("user_role", ["student", "teacher", "admin"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: userRole("role").notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

// 7-char class codes, no look-alike characters (0/O, 1/I/L)
const generateJoinCode = customAlphabet("ABCDEFGHJKMNPQRSTUVWXYZ23456789", 7);

// ---------- helpers ----------
const id = () =>
	text("id")
		.primaryKey()
		.$defaultFn(() => nanoid());

const timestamps = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
};

// ---------- enums ----------
export const courseStatus = pgEnum("course_status", [
	"draft",
	"published",
	"archived",
]);
export const courseLevel = pgEnum("course_level", ["minor", "major"]);
export const lessonType = pgEnum("lesson_type", [
	"video",
	"text",
	"quiz",
	"assignment",
]);
export const classroomRole = pgEnum("classroom_role", ["teacher", "student"]);
export const questionType = pgEnum("question_type", [
	"single_choice",
	"multiple_choice",
	"true_false",
]);
export const submissionStatus = pgEnum("submission_status", [
	"submitted",
	"graded",
	"returned",
]);

// ---------- catalog ----------
export const category = pgTable("category", {
	id: id(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
});

export const department = pgTable("department", {
	id: id(),
	name: text("name").notNull().unique(), // e.g. "Mathematics", "Science"
	code: text("code").unique(), // e.g. "MATH", optional short code
	description: text("description"),
});

export const course = pgTable(
	"course",
	{
		id: id(),
		title: text("title").notNull(),
		slug: text("slug").notNull().unique(),
		summary: text("summary"),
		description: text("description"),
		thumbnailUrl: text("thumbnail_url"),
		level: courseLevel("level").default("major").notNull(), // minor / major subject
		gradeLevel: integer("grade_level"), // e.g. 7 for Grade 7; null if it spans grades
		status: courseStatus("status").default("draft").notNull(),
		priceCents: integer("price_cents").default(0).notNull(),
		currency: text("currency").default("USD").notNull(),
		publishedAt: timestamp("published_at"),
		instructorId: text("instructor_id")
			.notNull()
			.references(() => user.id, { onDelete: "restrict" }),
		categoryId: text("category_id").references(() => category.id, {
			onDelete: "set null",
		}),
		departmentId: text("department_id").references(() => department.id, {
			onDelete: "set null",
		}),
		...timestamps,
	},
	(t) => [
		index("course_instructor_idx").on(t.instructorId),
		index("course_category_idx").on(t.categoryId),
		index("course_department_idx").on(t.departmentId),
		index("course_grade_level_idx").on(t.gradeLevel),
	],
);

// ---------- content ----------
export const section = pgTable(
	"section",
	{
		id: id(),
		courseId: text("course_id")
			.notNull()
			.references(() => course.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		position: integer("position").notNull(),
		...timestamps,
	},
	(t) => [index("section_course_idx").on(t.courseId)],
);

export const lesson = pgTable(
	"lesson",
	{
		id: id(),
		sectionId: text("section_id")
			.notNull()
			.references(() => section.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		type: lessonType("type").default("video").notNull(),
		content: text("content"), // markdown / rich text
		videoUrl: text("video_url"),
		durationSeconds: integer("duration_seconds"),
		position: integer("position").notNull(),
		isPreview: boolean("is_preview").default(false).notNull(), // watchable without enrolling
		...timestamps,
	},
	(t) => [index("lesson_section_idx").on(t.sectionId)],
);

// ---------- learner activity ----------
// A classroom is one run of a course for a group of people, joined with a code.
// ("class" is a reserved word in JS/TS, hence "classroom")
export const classroom = pgTable(
	"classroom",
	{
		id: id(),
		courseId: text("course_id")
			.notNull()
			.references(() => course.id, { onDelete: "cascade" }),
		ownerId: text("owner_id")
			.notNull()
			.references(() => user.id, { onDelete: "restrict" }),
		name: text("name").notNull(), // e.g. "Algebra I - Period 3"
		description: text("description"),
		joinCode: text("join_code")
			.notNull()
			.unique()
			.$defaultFn(() => generateJoinCode()),
		joinEnabled: boolean("join_enabled").default(true).notNull(), // teacher can turn the code off
		archivedAt: timestamp("archived_at"),
		...timestamps,
	},
	(t) => [
		index("classroom_course_idx").on(t.courseId),
		index("classroom_owner_idx").on(t.ownerId),
	],
);

// Membership: replaces "enrollment". Role is per classroom, like Google Classroom.
export const classroomMember = pgTable(
	"classroom_member",
	{
		id: id(),
		classroomId: text("classroom_id")
			.notNull()
			.references(() => classroom.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: classroomRole("role").default("student").notNull(),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
	},
	(t) => [
		uniqueIndex("classroom_member_uidx").on(t.classroomId, t.userId),
		index("classroom_member_user_idx").on(t.userId),
	],
);

export const lessonProgress = pgTable(
	"lesson_progress",
	{
		id: id(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		lessonId: text("lesson_id")
			.notNull()
			.references(() => lesson.id, { onDelete: "cascade" }),
		lastPositionSeconds: integer("last_position_seconds").default(0).notNull(),
		completedAt: timestamp("completed_at"),
		...timestamps,
	},
	(t) => [
		uniqueIndex("lesson_progress_user_lesson_uidx").on(t.userId, t.lessonId),
	],
);

// ---------- quizzes ----------
export const quiz = pgTable(
	"quiz",
	{
		id: id(),
		lessonId: text("lesson_id")
			.notNull()
			.references(() => lesson.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		passingScore: integer("passing_score").default(70).notNull(), // percent
		maxAttempts: integer("max_attempts"), // null = unlimited
		timeLimitMinutes: integer("time_limit_minutes"),
		...timestamps,
	},
	(t) => [index("quiz_lesson_idx").on(t.lessonId)],
);

export const question = pgTable(
	"question",
	{
		id: id(),
		quizId: text("quiz_id")
			.notNull()
			.references(() => quiz.id, { onDelete: "cascade" }),
		type: questionType("type").default("single_choice").notNull(),
		prompt: text("prompt").notNull(),
		points: integer("points").default(1).notNull(),
		position: integer("position").notNull(),
	},
	(t) => [index("question_quiz_idx").on(t.quizId)],
);

export const questionOption = pgTable(
	"question_option",
	{
		id: id(),
		questionId: text("question_id")
			.notNull()
			.references(() => question.id, { onDelete: "cascade" }),
		text: text("text").notNull(),
		isCorrect: boolean("is_correct").default(false).notNull(),
		position: integer("position").notNull(),
	},
	(t) => [index("question_option_question_idx").on(t.questionId)],
);

export const quizAttempt = pgTable(
	"quiz_attempt",
	{
		id: id(),
		quizId: text("quiz_id")
			.notNull()
			.references(() => quiz.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		answers: jsonb("answers").$type<Record<string, string[]>>(), // { questionId: [optionId, ...] }
		score: integer("score"), // percent
		passed: boolean("passed"),
		startedAt: timestamp("started_at").defaultNow().notNull(),
		submittedAt: timestamp("submitted_at"),
	},
	(t) => [index("quiz_attempt_quiz_user_idx").on(t.quizId, t.userId)],
);

// ---------- assignments ----------
export const assignment = pgTable(
	"assignment",
	{
		id: id(),
		lessonId: text("lesson_id")
			.notNull()
			.references(() => lesson.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		instructions: text("instructions"),
		maxPoints: integer("max_points").default(100).notNull(),
		dueAt: timestamp("due_at"),
		...timestamps,
	},
	(t) => [index("assignment_lesson_idx").on(t.lessonId)],
);

export const submission = pgTable(
	"submission",
	{
		id: id(),
		assignmentId: text("assignment_id")
			.notNull()
			.references(() => assignment.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		content: text("content"),
		fileUrl: text("file_url"),
		status: submissionStatus("status").default("submitted").notNull(),
		grade: integer("grade"),
		feedback: text("feedback"),
		gradedBy: text("graded_by").references(() => user.id, {
			onDelete: "set null",
		}),
		submittedAt: timestamp("submitted_at").defaultNow().notNull(),
		gradedAt: timestamp("graded_at"),
	},
	(t) => [
		uniqueIndex("submission_assignment_user_uidx").on(t.assignmentId, t.userId),
	],
);

// ---------- feedback ----------
export const review = pgTable(
	"review",
	{
		id: id(),
		courseId: text("course_id")
			.notNull()
			.references(() => course.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		rating: integer("rating").notNull(), // 1-5, add a CHECK constraint if you want it enforced
		comment: text("comment"),
		...timestamps,
	},
	(t) => [uniqueIndex("review_course_user_uidx").on(t.courseId, t.userId)],
);
