export interface ApiResponse<T> {
	data: T;
}

export interface ApiErrorResponse {
	error: true;
	message: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;