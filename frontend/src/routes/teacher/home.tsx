import { useQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/lib/session";

const TeacherHome = () => {
	const { data: user } = useQuery(sessionQueryOptions);

	return <div>Welcome, teacher {user?.name}</div>;
};

export default TeacherHome;
