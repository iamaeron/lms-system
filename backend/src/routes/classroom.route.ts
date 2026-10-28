import { Hono } from "hono";
import { classroomControllers as ctrl } from "@/controllers/classroom.controller";
import type { AppEnv } from "@/lib/env";

const app = new Hono<AppEnv>().basePath("/classrooms");

export const classroomRoutes = app
	.get("/", ...ctrl.list)
	.post("/", ...ctrl.create)
	.post("/join", ...ctrl.join)
	.get("/:classroomId", ...ctrl.get)
	.patch("/:classroomId", ...ctrl.update)
	.post("/:classroomId/join-code", ...ctrl.regenerateJoinCode)
	.get("/:classroomId/members", ...ctrl.members)
	// "me" must come before ":userId"
	.delete("/:classroomId/members/me", ...ctrl.leave)
	.delete("/:classroomId/members/:userId", ...ctrl.removeMember);
