import {
	courseLessonParam,
	courseParam,
	courseSectionParam,
	createCourseSchema,
	createLessonSchema,
	createSectionSchema,
	saveQuizSchema,
	updateLessonSchema,
	updateSectionSchema,
} from "@shared/schema/course.schema";
import { factory } from "@/lib/env";
import { validate } from "@/lib/validate";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { courseService } from "@/services/course.service";

const teacherOnly = requireRole("teacher");

export const courseControllers = {
	list: factory.createHandlers(
		requireAuth,
		teacherOnly,
		async (c) => {
			const data = await courseService.listForInstructor(c.get("user").id);
			return c.json({ data });
		},
	),

	create: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("json", createCourseSchema),
		async (c) => {
			const data = await courseService.create(
				c.get("user").id,
				c.req.valid("json"),
			);
			return c.json({ data }, 201);
		},
	),

	get: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseParam),
		async (c) => {
			const { courseId } = c.req.valid("param");
			const data = await courseService.getById(c.get("user").id, courseId);
			return c.json({ data });
		},
	),

	createSection: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseParam),
		validate("json", createSectionSchema),
		async (c) => {
			const { courseId } = c.req.valid("param");
			const data = await courseService.createSection(
				c.get("user").id,
				courseId,
				c.req.valid("json"),
			);
			return c.json({ data }, 201);
		},
	),

	updateSection: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseSectionParam),
		validate("json", updateSectionSchema),
		async (c) => {
			const { courseId, sectionId } = c.req.valid("param");
			const data = await courseService.updateSection(
				c.get("user").id,
				courseId,
				sectionId,
				c.req.valid("json"),
			);
			return c.json({ data });
		},
	),

	deleteSection: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseSectionParam),
		async (c) => {
			const { courseId, sectionId } = c.req.valid("param");
			await courseService.deleteSection(c.get("user").id, courseId, sectionId);
			return c.body(null, 204);
		},
	),

	createLesson: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseSectionParam),
		validate("json", createLessonSchema),
		async (c) => {
			const { courseId, sectionId } = c.req.valid("param");
			const data = await courseService.createLesson(
				c.get("user").id,
				courseId,
				sectionId,
				c.req.valid("json"),
			);
			return c.json({ data }, 201);
		},
	),

	updateLesson: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseLessonParam),
		validate("json", updateLessonSchema),
		async (c) => {
			const { courseId, lessonId } = c.req.valid("param");
			const data = await courseService.updateLesson(
				c.get("user").id,
				courseId,
				lessonId,
				c.req.valid("json"),
			);
			return c.json({ data });
		},
	),

	deleteLesson: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseLessonParam),
		async (c) => {
			const { courseId, lessonId } = c.req.valid("param");
			await courseService.deleteLesson(c.get("user").id, courseId, lessonId);
			return c.body(null, 204);
		},
	),

	saveQuiz: factory.createHandlers(
		requireAuth,
		teacherOnly,
		validate("param", courseLessonParam),
		validate("json", saveQuizSchema),
		async (c) => {
			const { courseId, lessonId } = c.req.valid("param");
			const data = await courseService.saveQuiz(
				c.get("user").id,
				courseId,
				lessonId,
				c.req.valid("json"),
			);
			return c.json({ data });
		},
	),
};
