import type { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, redirect } from "react-router";
import { paths } from "./config/paths";
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

const lazyImport = (route: string) =>
  import(route).then((m) => ({ Component: m.default }));

export function createRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: paths.login.path,
      loader: publicOnlyLoader(queryClient),
      lazy: () => lazyImport("./routes/login"),
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
              lazy: () => lazyImport("./routes/student/home"),
            },
          ],
        },
        {
          path: "teacher",
          loader: requireRole(queryClient, "teacher"),
          lazy: () => lazyImport("./layouts/app-layout"),
          children: [
            {
              index: true,
              lazy: () => lazyImport("./routes/teacher/home"),
            },
            {
              path: paths.portal.teacher.classrooms.path,
              lazy: () => lazyImport("./routes/teacher/classrooms"),
            },
          ],
        },
      ],
    },
  ]);
}
