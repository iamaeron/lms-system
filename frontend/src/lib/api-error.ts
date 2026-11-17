function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === "object"
		? (value as Record<string, unknown>)
		: undefined;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
	const errorRecord = asRecord(error);
	const response = asRecord(errorRecord?.response);
	const data = asRecord(response?.data);
	const apiError = asRecord(data?.error);
	const message =
		(typeof apiError?.message === "string" && apiError.message) ||
		(typeof data?.message === "string" && data.message) ||
		(typeof errorRecord?.message === "string" && errorRecord.message);
	return message || fallback;
}
