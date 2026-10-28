import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { AppEnv, AuthUser } from "../lib/env";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
	if (!c.get("user")) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}
	await next();
});

// Global role (user.role). Run after requireAuth.
export const requireRole = (...roles: AuthUser["role"][]) =>
	createMiddleware<AppEnv>(async (c, next) => {
		if (!roles.includes(c.get("user").role)) {
			throw new HTTPException(403, { message: "Forbidden" });
		}
		await next();
	});
