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
// "assignment" was removed: assignments now live in the classroom (see `post`)
export const lessonType = pgEnum("lesson_type", ["video", "text", "quiz"]);
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
export const postType = pgEnum("post_type", [
	"announcement", // stream only
	"material", // classwork, no grading
	"assignment", // classwork, due date + points + submissions
	"quiz", // classwork, points to a quiz from a course
]);
export const postStatus = pgEnum("post_status", [
	"draft",
	"scheduled",
	"published",
]);
export const attachmentKind = pgEnum("attachment_kind", [
	"course",
	"lesson",
	"link",
	"file",
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

// ---------- course library ----------
// Courses are reusable content (sections -> lessons -> quizzes).
// They are NOT tied to a classroom; teachers attach them to posts.
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
		isPreview: boolean("is_preview").default(false).notNull(), // watchable without joining a class
		...timestamps,
	},
	(t) => [index("lesson_section_idx").on(t.sectionId)],
);

// ---------- classrooms ----------
// A classroom is a class group (e.g. "Grade 8 - Rizal"), joined with a code.
// It contains a stream, classwork organised by topic, and people.
// ("class" is a reserved word in JS/TS, hence "classroom")
export const classroom = pgTable(
	"classroom",
	{
		id: id(),
		ownerId: text("owner_id")
			.notNull()
			.references(() => user.id, { onDelete: "restrict" }),
		name: text("name").notNull(), // e.g. "Algebra I"
		section: text("section"), // e.g. "Period 3" / "Rizal"
		subject: text("subject"), // e.g. "Mathematics"
		gradeLevel: integer("grade_level"),
		description: text("description"),
		joinCode: text("join_code")
			.notNull()
			.unique()
			.$defaultFn(() => generateJoinCode()),
		joinEnabled: boolean("join_enabled").default(true).notNull(), // teacher can turn the code off
		archivedAt: timestamp("archived_at"),
		...timestamps,
	},
	(t) => [index("classroom_owner_idx").on(t.ownerId)],
);

// Membership. Role is per classroom, like Google Classroom.
// The owner should also get a "teacher" row here.
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

// Topics group classwork ("Week 1", "Module 2", "Quizzes")
export const topic = pgTable(
	"topic",
	{
		id: id(),
		classroomId: text("classroom_id")
			.notNull()
			.references(() => classroom.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		position: integer("position").notNull(),
		...timestamps,
	},
	(t) => [index("topic_classroom_idx").on(t.classroomId)],
);

// ---------- stream + classwork ----------
// One table for everything a teacher posts:
//   announcement -> stream only
//   material     -> classwork, attachments only
//   assignment   -> classwork, dueAt / maxPoints / submissions
//   quiz         -> classwork, points at a quiz from a course
export const post = pgTable(
	"post",
	{
		id: id(),
		classroomId: text("classroom_id")
			.notNull()
			.references(() => classroom.id, { onDelete: "cascade" }),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		topicId: text("topic_id").references(() => topic.id, {
			onDelete: "set null",
		}),
		type: postType("type").notNull(),
		title: text("title"), // null is fine for announcements
		body: text("body"), // announcement text / instructions
		status: postStatus("status").default("published").notNull(),
		scheduledAt: timestamp("scheduled_at"),
		publishedAt: timestamp("published_at"),
		// assignment + quiz
		dueAt: timestamp("due_at"),
		maxPoints: integer("max_points"), // null = ungraded
		// quiz only
		quizId: text("quiz_id").references(() => quiz.id, {
			onDelete: "set null",
		}),
		...timestamps,
	},
	(t) => [
		index("post_classroom_idx").on(t.classroomId, t.publishedAt),
		index("post_topic_idx").on(t.topicId),
		index("post_author_idx").on(t.authorId),
	],
);

// Things attached to a post: a whole course, a single lesson, a link or a file
export const postAttachment = pgTable(
	"post_attachment",
	{
		id: id(),
		postId: text("post_id")
			.notNull()
			.references(() => post.id, { onDelete: "cascade" }),
		kind: attachmentKind("kind").notNull(),
		courseId: text("course_id").references(() => course.id, {
			onDelete: "cascade",
		}),
		lessonId: text("lesson_id").references(() => lesson.id, {
			onDelete: "cascade",
		}),
		name: text("name"), // display name for links and files
		url: text("url"), // link or file URL
		position: integer("position").default(0).notNull(),
	},
	(t) => [index("post_attachment_post_idx").on(t.postId)],
);

// Class comments under a post
export const postComment = pgTable(
	"post_comment",
	{
		id: id(),
		postId: text("post_id")
			.notNull()
			.references(() => post.id, { onDelete: "cascade" }),
		authorId: text("author_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		body: text("body").notNull(),
		...timestamps,
	},
	(t) => [index("post_comment_post_idx").on(t.postId)],
);

// ---------- student work ----------
// A student's turn-in for an assignment post
export const submission = pgTable(
	"submission",
	{
		id: id(),
		postId: text("post_id")
			.notNull()
			.references(() => post.id, { onDelete: "cascade" }),
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
	(t) => [uniqueIndex("submission_post_user_uidx").on(t.postId, t.userId)],
);

// Progress is per classroom, so the same course in two classes is tracked separately
export const lessonProgress = pgTable(
	"lesson_progress",
	{
		id: id(),
		classroomId: text("classroom_id")
			.notNull()
			.references(() => classroom.id, { onDelete: "cascade" }),
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
		uniqueIndex("lesson_progress_class_user_lesson_uidx").on(
			t.classroomId,
			t.userId,
			t.lessonId,
		),
		index("lesson_progress_user_idx").on(t.userId),
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
		// set when taken as classwork, so attempts are scoped to one classroom post
		postId: text("post_id").references(() => post.id, {
			onDelete: "cascade",
		}),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		answers: jsonb("answers").$type<Record<string, string[]>>(), // { questionId: [optionId, ...] }
		score: integer("score"), // percent
		passed: boolean("passed"),
		startedAt: timestamp("started_at").defaultNow().notNull(),
		submittedAt: timestamp("submitted_at"),
	},
	(t) => [
		index("quiz_attempt_quiz_user_idx").on(t.quizId, t.userId),
		index("quiz_attempt_post_idx").on(t.postId),
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
