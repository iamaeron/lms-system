import { z } from "zod";

const optionalText = (maxLength: number) =>
	z
		.string()
		.trim()
		.max(maxLength)
		.transform((value) => value || undefined)
		.optional();

export const createCourseSchema = z.object({
	title: z.string().trim().min(1).max(160),
	summary: optionalText(500),
	description: optionalText(10000),
	thumbnailUrl: z
		.union([z.url(), z.literal("")])
		.optional()
		.transform((value) => value || undefined),
	departmentId: z.string().trim().min(1).optional(),
});

export const courseParam = z.object({ courseId: z.string().min(1) });

export const courseSectionParam = courseParam.extend({
	sectionId: z.string().min(1),
});

export const courseLessonParam = courseParam.extend({
	lessonId: z.string().min(1),
});

export const createSectionSchema = z.object({
	title: z.string().trim().min(1).max(160),
});

export const updateSectionSchema = createSectionSchema
	.partial()
	.refine((value) => Object.keys(value).length > 0, {
		message: "Provide a section title to update",
	});

export const createLessonSchema = z.object({
	title: z.string().trim().min(1).max(160),
	type: z.enum(["video", "text", "quiz"]),
	content: optionalText(50000),
	videoUrl: z
		.union([z.url(), z.literal("")])
		.optional()
		.transform((value) => value || undefined),
	durationSeconds: z.number().int().min(1).max(86400).optional(),
	isPreview: z.boolean().default(false),
});

export const updateLessonSchema = z
	.object({
		title: z.string().trim().min(1).max(160).optional(),
		content: z
			.string()
			.trim()
			.max(50000)
			.nullable()
			.optional()
			.transform((value) => (value === "" ? null : value)),
		videoUrl: z
			.union([z.url(), z.literal("")])
			.nullable()
			.optional()
			.transform((value) => (value === "" ? null : value)),
		durationSeconds: z.number().int().min(1).max(86400).nullable().optional(),
		isPreview: z.boolean().optional(),
	})
	.refine((value) => Object.keys(value).length > 0, {
		message: "Provide at least one lesson field to update",
	});

const quizOptionSchema = z.object({
	text: z.string().trim().min(1).max(500),
	isCorrect: z.boolean(),
});

const quizQuestionSchema = z
	.object({
		type: z.enum(["single_choice", "multiple_choice", "true_false"]),
		prompt: z.string().trim().min(1).max(2000),
		points: z.number().int().min(1).max(1000),
		options: z.array(quizOptionSchema).min(2).max(6),
	})
	.superRefine((value, context) => {
		const correctCount = value.options.filter((option) => option.isCorrect).length;
		const isValid =
			value.type === "single_choice"
				? correctCount === 1
				: value.type === "true_false"
					? value.options.length === 2 && correctCount === 1
					: correctCount > 0;

		if (!isValid) {
			context.addIssue({
				code: "custom",
				message:
					value.type === "multiple_choice"
						? "Select at least one correct option"
						: "Select exactly one correct option",
				path: ["options"],
			});
		}
	});

export const saveQuizSchema = z.object({
	title: z.string().trim().min(1).max(160),
	passingScore: z.number().int().min(0).max(100),
	maxAttempts: z.number().int().min(1).max(100).nullable(),
	timeLimitMinutes: z.number().int().min(1).max(1440).nullable(),
	questions: z.array(quizQuestionSchema).max(100),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type SaveQuizInput = z.infer<typeof saveQuizSchema>;
