import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Department = {
	id: string;
	name: string;
	code: string | null;
	description: string | null;
};

export const departmentQueries = {
	list: () =>
		queryOptions({
			queryKey: ["departments", "list"],
			queryFn: async () => {
				const response = await api.get<{ data: Department[] }>("/api/departments");
				if (response.status !== 200) {
					throw new Error("Failed to load departments");
				}
				return response.data.data;
			},
		}),
};
