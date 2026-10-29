import { db } from "@/db";

export const departmentService = {
	list() {
		return db.query.department.findMany({
			orderBy: (department, { asc }) => [asc(department.code)],
		});
	},
};
