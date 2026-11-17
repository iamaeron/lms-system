import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { notification } from "@/db/schema";

export const notificationService = {
	list(userId: string) {
		return db.query.notification.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			limit: 50,
		});
	},

	async markRead(userId: string, notificationId: string) {
		const [updated] = await db
			.update(notification)
			.set({ readAt: new Date() })
			.where(
				and(
					eq(notification.id, notificationId),
					eq(notification.userId, userId),
				),
			)
			.returning();
		return updated ?? null;
	},

	async remove(userId: string, notificationId: string) {
		const [removed] = await db
			.delete(notification)
			.where(
				and(
					eq(notification.id, notificationId),
					eq(notification.userId, userId),
				),
			)
			.returning({ id: notification.id });
		return removed ?? null;
	},

	clear(userId: string) {
		return db
			.delete(notification)
			.where(eq(notification.userId, userId));
	},
};
