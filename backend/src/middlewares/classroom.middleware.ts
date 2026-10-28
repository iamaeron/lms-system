import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db } from "@/db";
import type { AppEnv, Membership } from "@/lib/env";

// Per-classroom role (classroomMember.role). Reads :classroomId from the path,
// loads the caller's membership and exposes it as c.get("membership").
// Non-members get a 404 so class ids can't be probed.
export const requireClassroomMember = (
	opts: { roles?: Membership["role"][] } = {},
) =>
	createMiddleware<AppEnv>(async (c, next) => {
		const classroomId = c.req.param("classroomId");
		if (!classroomId) {
			throw new HTTPException(400, { message: "Missing classroom id" });
		}

		const membership = await db.query.classroomMember.findFirst({
			where: { classroomId, userId: c.get("user").id },
		});

		if (!membership) {
			throw new HTTPException(404, { message: "Classroom not found" });
		}
		if (opts.roles && !opts.roles.includes(membership.role)) {
			throw new HTTPException(403, { message: "Forbidden" });
		}

		c.set("membership", membership);
		await next();
	});
