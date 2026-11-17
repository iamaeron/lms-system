import type { CourseDetailResponse, CourseListResponse } from "@shared/index";
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const courseQueries = {
	list: () =>
		queryOptions({
			queryKey: ["courses", "list"],
			queryFn: async () => {
				const response = await api.get<CourseListResponse>("/api/courses");
				if (response.status !== 200) {
					throw new Error("Failed to load courses");
				}
				return response.data;
			},
		}),
	detail: (courseId: string) =>
		queryOptions({
			queryKey: ["courses", "detail", courseId],
			queryFn: async () => {
				const response = await api.get<CourseDetailResponse>(
					`/api/courses/${courseId}`,
				);
				if (response.status !== 200) {
					throw new Error("Failed to load course");
				}
				return response.data;
			},
		}),
};
