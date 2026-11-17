import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type AppNotification = {
	id: string;
	title: string;
	description: string | null;
	readAt: string | null;
	createdAt: string;
};

export const notificationQueries = {
	list: () =>
		queryOptions({
			queryKey: ["notifications", "list"],
			queryFn: async () => {
				const response = await api.get<{ data: AppNotification[] }>(
					"/api/notifications",
				);
				if (response.status !== 200) {
					throw new Error("Failed to load notifications");
				}
				return response.data.data;
			},
		}),
};

export const notificationMutations = {
	remove: async (id: string) => api.delete(`/api/notifications/${id}`),
	clear: async () => api.delete("/api/notifications"),
	markRead: async (id: string) => api.patch(`/api/notifications/${id}/read`),
};
