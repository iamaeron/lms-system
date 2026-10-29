import { z } from "zod";

export const classroomParam = z.object({ classroomId: z.string().min(1) });

export const memberParam = z.object({
	classroomId: z.string().min(1),
	userId: z.string().min(1),
});

export const listQuery = z.object({
	archived: z
		.enum(["true", "false"])
		.optional()
		.transform((v) => v === "true"),
});

export const createClassroomSchema = z.object({
	name: z.string().trim().min(1).max(100),
	section: z.string().trim().max(100).optional(),
	subject: z.string().trim().max(100).optional(),
	gradeLevel: z.number().int().min(1).max(20).optional(),
	description: z.string().trim().max(1000).optional(),
	departmentId: z.string().min(1).optional(),
	subjectCode: z
		.string()
		.trim()
		.toUpperCase()
		.max(12)
		.regex(/^[A-Z0-9-]*$/, "Letters, numbers and dashes only")
		.transform((v) => v || undefined) // "" means not provided
		.optional(),
});

export const updateClassroomSchema = createClassroomSchema
	.partial()
	.extend({
		joinEnabled: z.boolean().optional(),
		archived: z.boolean().optional(),
	})
	.refine((v) => Object.keys(v).length > 0, {
		message: "Provide at least one field to update",
	});

export const joinClassroomSchema = z.object({
	code: z
		.string()
		.trim()
		.toUpperCase()
		.length(7, "Class codes are 7 characters"),
});

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;
