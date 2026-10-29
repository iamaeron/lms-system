import {
	classroomParam,
	createClassroomSchema,
	joinClassroomSchema,
	listQuery,
	memberParam,
	updateClassroomSchema,
} from "@shared/schema/classroom.schema";
import { factory } from "@/lib/env";
import { validate } from "@/lib/validate";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware";
import { requireClassroomMember } from "@/middlewares/classroom.middleware";
import { classroomService } from "@/services/classroom.service";

const teacherOnly = requireClassroomMember({ roles: ["teacher"] });

// Controllers stay thin: validate -> authorize -> call service -> respond.
export const classroomControllers = {
	list: factory.createHandlers(
		requireAuth,
		validate("query", listQuery),
		async (c) => {
			const { archived } = c.req.valid("query");
			const data = await classroomService.listForUser(
				c.get("user").id,
				archived,
			);
			return c.json({ data });
		},
	),

	create: factory.createHandlers(
		requireAuth,
		requireRole("teacher", "admin"),
		validate("json", createClassroomSchema),
		async (c) => {
			const data = await classroomService.create(
				c.get("user").id,
				c.req.valid("json"),
			);
			return c.json({ data }, 201);
		},
	),

	join: factory.createHandlers(
		requireAuth,
		validate("json", joinClassroomSchema),
		async (c) => {
			const { code } = c.req.valid("json");
			const data = await classroomService.join(c.get("user").id, code);
			return c.json({ data });
		},
	),

	get: factory.createHandlers(
		requireAuth,
		validate("param", classroomParam),
		requireClassroomMember(),
		async (c) => {
			const { classroomId } = c.req.valid("param");
			const data = await classroomService.getById(
				classroomId,
				c.get("membership").role,
			);
			return c.json({ data });
		},
	),

	update: factory.createHandlers(
		requireAuth,
		validate("param", classroomParam),
		teacherOnly,
		validate("json", updateClassroomSchema),
		async (c) => {
			const { classroomId } = c.req.valid("param");
			const data = await classroomService.update(
				classroomId,
				c.req.valid("json"),
			);
			return c.json({ data });
		},
	),

	regenerateJoinCode: factory.createHandlers(
		requireAuth,
		validate("param", classroomParam),
		teacherOnly,
		async (c) => {
			const { classroomId } = c.req.valid("param");
			const data = await classroomService.regenerateJoinCode(classroomId);
			return c.json({ data });
		},
	),

	members: factory.createHandlers(
		requireAuth,
		validate("param", classroomParam),
		requireClassroomMember(),
		async (c) => {
			const { classroomId } = c.req.valid("param");
			const data = await classroomService.listMembers(classroomId);
			return c.json({ data });
		},
	),

	leave: factory.createHandlers(
		requireAuth,
		validate("param", classroomParam),
		requireClassroomMember(),
		async (c) => {
			const { classroomId } = c.req.valid("param");
			await classroomService.removeMember(classroomId, c.get("user").id);
			return c.body(null, 204);
		},
	),

	removeMember: factory.createHandlers(
		requireAuth,
		validate("param", memberParam),
		teacherOnly,
		async (c) => {
			const { classroomId, userId } = c.req.valid("param");
			await classroomService.removeMember(classroomId, userId);
			return c.body(null, 204);
		},
	),
};
