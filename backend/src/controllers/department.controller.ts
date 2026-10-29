import { factory } from "@/lib/env";
import { requireAuth } from "@/middlewares/auth.middleware";
import { departmentService } from "@/services/department.service";

export const departmentControllers = {
	list: factory.createHandlers(requireAuth, async (c) => {
		const data = await departmentService.list();
		return c.json({ data });
	}),
};
