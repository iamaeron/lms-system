import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

// Every error leaves the API in the same shape: { error: { message } }
export const onError: ErrorHandler = (err, c) => {
	if (err instanceof HTTPException) {
		return c.json(
			{ error: { message: err.message } },
			err.status as ContentfulStatusCode,
		);
	}

	console.error(err);
	return c.json({ error: { message: "Internal Server Error" } }, 500);
};

export const notFound: NotFoundHandler = (c) =>
	c.json({ error: { message: "Not Found" } }, 404);

// Postgres unique_violation (drizzle may wrap the driver error in `cause`)
export function isUniqueViolation(error: unknown) {
	const e = error as { code?: string; cause?: { code?: string } };
	return e?.code === "23505" || e?.cause?.code === "23505";
}
