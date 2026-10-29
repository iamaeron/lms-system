import { useQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/lib/session";
import { Button } from "@/ui/button";
import { toastManager } from "@/ui/toast";

const StudentHome = () => {
	const { data: user } = useQuery(sessionQueryOptions);

	return (
		<div>
			Welcome, student {user?.name}{" "}
			<Button
				onClick={() =>
					toastManager.add({
						title: `Toast created`,
						description: "This is a toast notification.",
					})
				}
			></Button>
		</div>
	);
};

export default StudentHome;
