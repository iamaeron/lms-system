import type { CreateClassroomInput } from "@shared/schema/classroom.schema";
import { api } from "@/lib/api";

export const classroomMutations = {
	create: async (data: CreateClassroomInput) => {
		const response = await api.post("/api/classrooms", data);
		return response.data;
	},
};
