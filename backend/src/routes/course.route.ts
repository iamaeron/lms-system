import { Hono } from "hono";
import { courseControllers as ctrl } from "@/controllers/course.controller";
import type { AppEnv } from "@/lib/env";

const app = new Hono<AppEnv>().basePath("/courses");

export const courseRoutes = app
	.get("/", ...ctrl.list)
	.post("/", ...ctrl.create)
	.get("/:courseId", ...ctrl.get)
	.post("/:courseId/sections", ...ctrl.createSection)
	.patch("/:courseId/sections/:sectionId", ...ctrl.updateSection)
	.delete("/:courseId/sections/:sectionId", ...ctrl.deleteSection)
	.post(
		"/:courseId/sections/:sectionId/lessons",
		...ctrl.createLesson,
	)
	.patch("/:courseId/lessons/:lessonId", ...ctrl.updateLesson)
	.delete("/:courseId/lessons/:lessonId", ...ctrl.deleteLesson)
	.put("/:courseId/lessons/:lessonId/quiz", ...ctrl.saveQuiz);
