import type { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, redirect } from "react-router";
import { paths } from "./config/paths";
import { classroomQueries } from "./features/classroom/queries";
import { courseQueries } from "./features/course/queries";
import { requireRole } from "./lib/guards";
import { protectedLoader, publicOnlyLoader } from "./lib/protected-loader";

// const convert = (queryClient: QueryClient) => (m: any) => {
//   const { clientLoader, clientAction, default: Component, ...rest } = m;
//   return {
//     ...rest,
//     loader: clientLoader?.(queryClient),
//     action: clientAction?.(queryClient),
//     Component,
//   };
// };
//

export function createRouter(queryClient: QueryClient) {
	return createBrowserRouter([
		{
			path: paths.login.path,
			loader: publicOnlyLoader(queryClient),
			lazy: () =>
				import("./routes/login").then((m) => ({ Component: m.default })),
		},
		{
			path: "/portal",
			children: [
				{
					index: true,
					loader: async () => {
						const data = await protectedLoader(queryClient)();
						throw redirect(`/portal/${data.user.role}`);
					},
				},
				{
					path: "student",
					loader: requireRole(queryClient, "student"),
					children: [
						{
							index: true,
							handle: { title: "Home" },
							lazy: () =>
								import("./routes/student/home").then((m) => ({
									Component: m.default,
								})),
						},
					],
				},
				{
					path: "teacher",
					loader: requireRole(queryClient, "teacher"),
					lazy: () =>
						import("./layouts/app-layout").then((m) => ({
							Component: m.default,
						})),
					children: [
						{
							index: true,
							handle: { title: "Home" },
							lazy: () =>
								import("./routes/teacher/home").then((m) => ({
									Component: m.default,
								})),
						},
						{
							path: paths.portal.teacher.classrooms.path,
							loader: () => queryClient.query(classroomQueries.list()),
							handle: { title: "Classrooms" },
							lazy: () =>
								import("./routes/teacher/classrooms").then((m) => ({
									Component: m.default,
								})),
						},
						{
							path: paths.portal.teacher.classroom.path,
							loader: async ({ params }) => {
								if (!params.classroomId)
									throw new Error("Missing classroom ID");
								return queryClient.query(
									classroomQueries.detail(params.classroomId),
								);
							},
							handle: { title: "Classroom", showBack: true },
							lazy: () =>
								import("./routes/teacher/classroom").then((m) => ({
									Component: m.default,
								})),
						},
						{
							path: paths.portal.teacher.course.path,
							loader: async ({ params }) => {
								if (!params.courseId) throw new Error("Missing course ID");
								return queryClient.query(
									courseQueries.detail(params.courseId),
								);
							},
							handle: { title: "Course Editor", showBack: true },
							lazy: () =>
								import("./routes/teacher/course").then((m) => ({
									Component: m.default,
								})),
						},
						{
							path: paths.portal.teacher.courses.path,
							loader: () => queryClient.query(courseQueries.list()),
							handle: { title: "Course Library" },
							lazy: () =>
								import("./routes/teacher/courses").then((m) => ({
									Component: m.default,
								})),
						},
					],
				},
			],
		},
	]);
}
