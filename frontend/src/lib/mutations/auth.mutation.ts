import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router"; // or your router of choice
import { authClient } from "@/lib/auth-client"; // Your Better Auth client instance

export function useSignInMutation() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async ({
			email,
			password,
			rememberMe,
		}: {
			email: string;
			password: string;
			rememberMe: boolean;
		}) => {
			// Execute the Better Auth signup call
			const response = await authClient.signIn.email({
				email,
				password,
				rememberMe,
			});

			if (response.error) {
				throw new Error(response.error.message || "Failed to sign up.");
			}

			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["session"] });
			navigate(`/portal/${data.user.role}/`);
		},
		onError: (error: Error) => {
			console.error("Sign up failed:", error.message);
		},
	});
}
