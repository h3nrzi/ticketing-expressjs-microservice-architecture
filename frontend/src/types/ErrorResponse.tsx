export interface Error {
	field?: string;
	message: string;
}

export interface ErrorResponse {
	errors: Error[];
}
