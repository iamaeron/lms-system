import { Hono } from "hono";
import { notificationControllers as ctrl } from "@/controllers/notification.controller";
import type { AppEnv } from "@/lib/env";

const app = new Hono<AppEnv>().basePath("/notifications");

export const notificationRoutes = app
	.get("/", ...ctrl.list)
	.delete("/", ...ctrl.clear)
	.patch("/:notificationId/read", ...ctrl.markRead)
	.delete("/:notificationId", ...ctrl.remove);
