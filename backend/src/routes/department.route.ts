import { Hono } from "hono";
import { departmentControllers as ctrl } from "@/controllers/department.controller";
import type { AppEnv } from "@/lib/env";

const app = new Hono<AppEnv>().basePath("/departments");

export const departmentRoutes = app.get("/", ...ctrl.list);
