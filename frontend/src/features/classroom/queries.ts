import type {
	ClassroomListResponse,
	ClassroomCourseworkResponse,
	ClassroomMembersResponse,
	ClassroomSingleResponse,
} from "@shared/index";
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
	members: (classroomId: string) =>
		queryOptions({
			queryKey: ["classrooms", "members", classroomId],
			queryFn: async () => {
				const res = await api.get(`/api/classrooms/${classroomId}/members`);
				if (res.status !== 200) throw new Error("Failed to load classroom members");
				return res.data as ClassroomMembersResponse;
			},
			staleTime: 60_000,
		}),
	courseClasswork: (classroomId: string) =>
		queryOptions({
			queryKey: ["classrooms", "classwork-courses", classroomId],
			queryFn: async () => {
				const response = await api.get<ClassroomCourseworkResponse>(
					`/api/classrooms/${classroomId}/classwork/courses`,
				);
				if (response.status !== 200) {
					throw new Error("Failed to load classroom course classwork");
				}
				return response.data;
			},
		}),
};
