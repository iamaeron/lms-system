import { z } from "zod";
import { factory } from "@/lib/env";
import { HTTPException } from "hono/http-exception";
import { validate } from "@/lib/validate";
import { requireAuth } from "@/middlewares/auth.middleware";
import { notificationService } from "@/services/notification.service";

const notificationParam = z.object({ notificationId: z.string().min(1) });

export const notificationControllers = {
	list: factory.createHandlers(requireAuth, async (c) => {
		const data = await notificationService.list(c.get("user").id);
		return c.json({ data });
	}),

	markRead: factory.createHandlers(
		requireAuth,
		validate("param", notificationParam),
		async (c) => {
			const { notificationId } = c.req.valid("param");
			const data = await notificationService.markRead(
				c.get("user").id,
				notificationId,
			);
			if (!data) throw new HTTPException(404, { message: "Notification not found" });
			return c.json({ data });
		},
	),

	remove: factory.createHandlers(
		requireAuth,
		validate("param", notificationParam),
		async (c) => {
			const { notificationId } = c.req.valid("param");
			const data = await notificationService.remove(
				c.get("user").id,
				notificationId,
			);
			if (!data) throw new HTTPException(404, { message: "Notification not found" });
			return c.body(null, 204);
		},
	),

	clear: factory.createHandlers(requireAuth, async (c) => {
		await notificationService.clear(c.get("user").id);
		return c.body(null, 204);
	}),
};
