import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	// ---------- auth ----------
	user: {
		sessions: r.many.session(),
		accounts: r.many.account(),
		taughtCourses: r.many.course(),
		ownedClassrooms: r.many.classroom(),
		memberships: r.many.classroomMember(),
		posts: r.many.post(),
		comments: r.many.postComment(),
		lessonProgress: r.many.lessonProgress(),
		quizAttempts: r.many.quizAttempt(),
		// two FKs point at user (userId + gradedBy), so these are aliased
		submissions: r.many.submission({
			from: r.user.id,
			to: r.submission.userId,
			alias: "submitter",
		}),
		gradedSubmissions: r.many.submission({
			from: r.user.id,
			to: r.submission.gradedBy,
			alias: "grader",
		}),
		reviews: r.many.review(),
	},
	session: {
		user: r.one.user({ from: r.session.userId, to: r.user.id }),
	},
	account: {
		user: r.one.user({ from: r.account.userId, to: r.user.id }),
	},

	// ---------- catalog ----------
	category: {
		courses: r.many.course(),
	},
	department: {
		courses: r.many.course(),
		classrooms: r.many.classroom(),
	},

	// ---------- course library ----------
	course: {
		instructor: r.one.user({ from: r.course.instructorId, to: r.user.id }),
		category: r.one.category({ from: r.course.categoryId, to: r.category.id }),
		department: r.one.department({
			from: r.course.departmentId,
			to: r.department.id,
		}),
		sections: r.many.section(),
		attachments: r.many.postAttachment(),
		reviews: r.many.review(),
	},
	section: {
		course: r.one.course({ from: r.section.courseId, to: r.course.id }),
		lessons: r.many.lesson(),
	},
	lesson: {
		section: r.one.section({ from: r.lesson.sectionId, to: r.section.id }),
		quizzes: r.many.quiz(),
		progress: r.many.lessonProgress(),
		attachments: r.many.postAttachment(),
	},

	// ---------- classrooms ----------
	classroom: {
		owner: r.one.user({ from: r.classroom.ownerId, to: r.user.id }),
		department: r.one.department({
			from: r.classroom.departmentId,
			to: r.department.id,
		}),
		members: r.many.classroomMember(),
		topics: r.many.topic(),
		posts: r.many.post(),
		lessonProgress: r.many.lessonProgress(),
	},
	classroomMember: {
		classroom: r.one.classroom({
			from: r.classroomMember.classroomId,
			to: r.classroom.id,
		}),
		user: r.one.user({ from: r.classroomMember.userId, to: r.user.id }),
	},
	topic: {
		classroom: r.one.classroom({
			from: r.topic.classroomId,
			to: r.classroom.id,
		}),
		posts: r.many.post(),
	},

	// ---------- stream + classwork ----------
	post: {
		classroom: r.one.classroom({
			from: r.post.classroomId,
			to: r.classroom.id,
		}),
		author: r.one.user({ from: r.post.authorId, to: r.user.id }),
		topic: r.one.topic({ from: r.post.topicId, to: r.topic.id }),
		quiz: r.one.quiz({ from: r.post.quizId, to: r.quiz.id }),
		attachments: r.many.postAttachment(),
		comments: r.many.postComment(),
		submissions: r.many.submission(),
		quizAttempts: r.many.quizAttempt(),
	},
	postAttachment: {
		post: r.one.post({ from: r.postAttachment.postId, to: r.post.id }),
		course: r.one.course({
			from: r.postAttachment.courseId,
			to: r.course.id,
		}),
		lesson: r.one.lesson({
			from: r.postAttachment.lessonId,
			to: r.lesson.id,
		}),
	},
	postComment: {
		post: r.one.post({ from: r.postComment.postId, to: r.post.id }),
		author: r.one.user({ from: r.postComment.authorId, to: r.user.id }),
	},

	// ---------- student work ----------
	submission: {
		post: r.one.post({ from: r.submission.postId, to: r.post.id }),
		user: r.one.user({
			from: r.submission.userId,
			to: r.user.id,
			alias: "submitter",
		}),
		grader: r.one.user({
			from: r.submission.gradedBy,
			to: r.user.id,
			alias: "grader",
		}),
	},
	lessonProgress: {
		classroom: r.one.classroom({
			from: r.lessonProgress.classroomId,
			to: r.classroom.id,
		}),
		user: r.one.user({ from: r.lessonProgress.userId, to: r.user.id }),
		lesson: r.one.lesson({ from: r.lessonProgress.lessonId, to: r.lesson.id }),
	},

	// ---------- quizzes ----------
	quiz: {
		lesson: r.one.lesson({ from: r.quiz.lessonId, to: r.lesson.id }),
		questions: r.many.question(),
		attempts: r.many.quizAttempt(),
		posts: r.many.post(),
	},
	question: {
		quiz: r.one.quiz({ from: r.question.quizId, to: r.quiz.id }),
		options: r.many.questionOption(),
	},
	questionOption: {
		question: r.one.question({
			from: r.questionOption.questionId,
			to: r.question.id,
		}),
	},
	quizAttempt: {
		quiz: r.one.quiz({ from: r.quizAttempt.quizId, to: r.quiz.id }),
		post: r.one.post({ from: r.quizAttempt.postId, to: r.post.id }),
		user: r.one.user({ from: r.quizAttempt.userId, to: r.user.id }),
	},

	// ---------- feedback ----------
	review: {
		course: r.one.course({ from: r.review.courseId, to: r.course.id }),
		user: r.one.user({ from: r.review.userId, to: r.user.id }),
	},
}));
