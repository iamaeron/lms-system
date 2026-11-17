import type { ClassroomListResponse, ClassroomSingleResponse } from "@shared/index";
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const classroomQueries = {
	list: () =>
		queryOptions({
			queryKey: ["classrooms", "list"],
			queryFn: async () => {
				const res = await api.get("/api/classrooms");
				if (res.status !== 200) throw new Error("Failed to load classrooms");
				return res.data as ClassroomListResponse;
			},
		}),
	detail: (classroomId: string) =>
		queryOptions({
			queryKey: ["classrooms", "detail", classroomId],
			queryFn: async () => {
				const res = await api.get(`/api/classrooms/${classroomId}`);
				if (res.status !== 200) throw new Error("Failed to load classroom");
				return res.data as ClassroomSingleResponse;
			},
		}),
};
