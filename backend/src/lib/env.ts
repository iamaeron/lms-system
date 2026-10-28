import { createFactory } from "hono/factory";
import type { classroomMember, user } from "@/db/schema";

export type AuthUser = typeof user.$inferSelect;
export type Membership = typeof classroomMember.$inferSelect;

// `user` is set by your existing session middleware (it may be missing on
// public routes, which is why protected routes run `requireAuth` first).
// `membership` is set by `requireClassroomMember`.
export type AppEnv = {
	Variables: {
		user: AuthUser;
		membership: Membership;
	};
};

export const factory = createFactory<AppEnv>();
