import { useQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/lib/session";
import { Button } from "@/ui/button";
import { toastManager } from "@/ui/toast";

const TeacherHome = () => {
	const { data: user } = useQuery(sessionQueryOptions);

	return (
		<div>
			Welcome, teacher {user?.name}{" "}
			<Button
				onClick={() =>
					toastManager.add({
						title: `Toast created`,
						description: "This is a toast notification.",
					})
				}
			>
				Toast
			</Button>
		</div>
	);
};

export default TeacherHome;
