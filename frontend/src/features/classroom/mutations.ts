import type { CreateClassroomInput } from "@shared/schema/classroom.schema";
import { api } from "@/lib/api";

export const classroomMutations = {
	create: async (data: CreateClassroomInput) => {
		const response = await api.post("/api/classrooms", data);
		return response.data;
	},
	addCourseToClasswork: async (classroomId: string, courseId: string) => {
		const response = await api.post(
			`/api/classrooms/${classroomId}/classwork/courses`,
			{ courseId },
		);
		return response.data;
	},
};
