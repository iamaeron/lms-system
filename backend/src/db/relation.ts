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
    lessonProgress: r.many.lessonProgress(),
    quizAttempts: r.many.quizAttempt(),
    submissions: r.many.submission({
      from: r.user.id,
      to: r.submission.userId,
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
  },
  course: {
    instructor: r.one.user({ from: r.course.instructorId, to: r.user.id }),
    category: r.one.category({ from: r.course.categoryId, to: r.category.id }),
    department: r.one.department({
      from: r.course.departmentId,
      to: r.department.id,
    }),
    sections: r.many.section(),
    classrooms: r.many.classroom(),
    reviews: r.many.review(),
  },

  // ---------- content ----------
  section: {
    course: r.one.course({ from: r.section.courseId, to: r.course.id }),
    lessons: r.many.lesson(),
  },
  lesson: {
    section: r.one.section({ from: r.lesson.sectionId, to: r.section.id }),
    progress: r.many.lessonProgress(),
    quizzes: r.many.quiz(),
    assignments: r.many.assignment(),
  },

  // ---------- learner activity ----------
  classroom: {
    course: r.one.course({ from: r.classroom.courseId, to: r.course.id }),
    owner: r.one.user({ from: r.classroom.ownerId, to: r.user.id }),
    members: r.many.classroomMember(),
  },
  classroomMember: {
    classroom: r.one.classroom({
      from: r.classroomMember.classroomId,
      to: r.classroom.id,
    }),
    user: r.one.user({ from: r.classroomMember.userId, to: r.user.id }),
  },
  lessonProgress: {
    user: r.one.user({ from: r.lessonProgress.userId, to: r.user.id }),
    lesson: r.one.lesson({ from: r.lessonProgress.lessonId, to: r.lesson.id }),
  },

  // ---------- quizzes ----------
  quiz: {
    lesson: r.one.lesson({ from: r.quiz.lessonId, to: r.lesson.id }),
    questions: r.many.question(),
    attempts: r.many.quizAttempt(),
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
    user: r.one.user({ from: r.quizAttempt.userId, to: r.user.id }),
  },

  // ---------- assignments ----------
  assignment: {
    lesson: r.one.lesson({ from: r.assignment.lessonId, to: r.lesson.id }),
    submissions: r.many.submission(),
  },
  submission: {
    assignment: r.one.assignment({
      from: r.submission.assignmentId,
      to: r.assignment.id,
    }),
    user: r.one.user({ from: r.submission.userId, to: r.user.id }),
  },

  // ---------- feedback ----------
  review: {
    course: r.one.course({ from: r.review.courseId, to: r.course.id }),
    user: r.one.user({ from: r.review.userId, to: r.user.id }),
  },
}));
