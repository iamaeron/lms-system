import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

// zValidator with the same error shape as the rest of the API
export const validate = <
	T extends ZodType,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) =>
	zValidator(target, schema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					error: {
						message: "Validation failed",
						issues: result.error.issues,
					},
				},
				400,
			);
		}
	});
