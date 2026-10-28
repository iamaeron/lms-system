import { QueryClient } from "@tanstack/react-query";
import { redirect } from "react-router";
import { sessionQueryOptions } from "./session";

type Role = "student" | "teacher" | "admin";

export const requireRole =
  (queryClient: QueryClient, role: Role) => async () => {
    const user = await queryClient.query(sessionQueryOptions);

    if (!user) throw redirect("/login");
    if (user.role !== role) throw redirect(`/portal/${user.role}`);
    return user;
  };
