import type { CreateCourseInput, CreateCourseResponse } from "@shared/index";
import type {
	CreateLessonInput,
	CreateSectionInput,
	SaveQuizInput,
	UpdateLessonInput,
	UpdateSectionInput,
} from "@shared/schema/course.schema";
import { api } from "@/lib/api";

export const courseMutations = {
	create: async (data: CreateCourseInput) => {
		const response = await api.post<CreateCourseResponse>("/api/courses", data);
		return response.data;
	},
	createSection: async (courseId: string, data: CreateSectionInput) => {
		const response = await api.post(
			`/api/courses/${courseId}/sections`,
			data,
		);
		return response.data;
	},
	updateSection: async (
		courseId: string,
		sectionId: string,
		data: UpdateSectionInput,
	) => {
		const response = await api.patch(
			`/api/courses/${courseId}/sections/${sectionId}`,
			data,
		);
		return response.data;
	},
	deleteSection: async (courseId: string, sectionId: string) => {
		await api.delete(`/api/courses/${courseId}/sections/${sectionId}`);
	},
	createLesson: async (
		courseId: string,
		sectionId: string,
		data: CreateLessonInput,
	) => {
		const response = await api.post(
			`/api/courses/${courseId}/sections/${sectionId}/lessons`,
			data,
		);
		return response.data;
	},
	updateLesson: async (
		courseId: string,
		lessonId: string,
		data: UpdateLessonInput,
	) => {
		const response = await api.patch(
			`/api/courses/${courseId}/lessons/${lessonId}`,
			data,
		);
		return response.data;
	},
	deleteLesson: async (courseId: string, lessonId: string) => {
		await api.delete(`/api/courses/${courseId}/lessons/${lessonId}`);
	},
	saveQuiz: async (
		courseId: string,
		lessonId: string,
		data: SaveQuizInput,
	) => {
		const response = await api.put(
			`/api/courses/${courseId}/lessons/${lessonId}/quiz`,
			data,
		);
		return response.data;
	},
};
