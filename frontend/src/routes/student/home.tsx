import { useQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/lib/session";

const StudentHome = () => {
    const { data: user } = useQuery(sessionQueryOptions);

    return <div>Welcome, student {user?.name}</div>;
};

export default StudentHome;
