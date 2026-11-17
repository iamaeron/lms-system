import type { CreateCourseInput } from "../schema/course.schema";

export type CourseLevel = "minor" | "major";
export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
	id: string;
	title: string;
	slug: string;
	summary: string | null;
	description: string | null;
	thumbnailUrl: string | null;
	level: CourseLevel;
	gradeLevel: number | null;
	status: CourseStatus;
	publishedAt: Date | null;
	instructorId: string;
	categoryId: string | null;
	departmentId: string | null;
	createdAt: Date;
	updatedAt: Date;
	category: { id: string; name: string; slug: string } | null;
	department: { id: string; name: string; code: string | null } | null;
}

export type CourseRecord = Omit<Course, "category" | "department">;
export type CreateCourseResponse = { data: CourseRecord };
export type CourseListResponse = { data: Course[] };
export interface CourseLesson {
	id: string;
	sectionId: string;
	title: string;
	type: "video" | "text" | "quiz";
	content: string | null;
	videoUrl: string | null;
	durationSeconds: number | null;
	position: number;
	isPreview: boolean;
	quizzes: CourseQuiz[];
}

export interface CourseSection {
	id: string;
	courseId: string;
	title: string;
	position: number;
	lessons: CourseLesson[];
}

export interface CourseQuiz {
	id: string;
	lessonId: string;
	title: string;
	passingScore: number;
	maxAttempts: number | null;
	timeLimitMinutes: number | null;
	updatedAt: Date;
	questions: CourseQuestion[];
}

export interface CourseQuestion {
	id: string;
	quizId: string;
	type: "single_choice" | "multiple_choice" | "true_false";
	prompt: string;
	points: number;
	position: number;
	options: CourseQuestionOption[];
}

export interface CourseQuestionOption {
	id: string;
	questionId: string;
	text: string;
	isCorrect: boolean;
	position: number;
}

export type CourseDetail = Course & { sections: CourseSection[] };
export type CourseDetailResponse = { data: CourseDetail };
export type { CreateCourseInput };
