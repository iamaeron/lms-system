import type { User } from "@shared/types/auth.type";
import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const sessionQueryOptions = queryOptions({
	queryKey: ["session"],
	queryFn: async () => {
		try {
			const { data } = await api.get("/api/auth/get-session");
			return data.user as User;
		} catch (_error) {
			return null;
		}
	},
	staleTime: 1000 * 60 * 5,
});
