"use server";

import { ErrorResponse } from "@/types/ErrorResponse";
import { FormState } from "@/types/FormState";
import axios, { AxiosError } from "axios";
import { cookieManager } from "../utils/cookie-utils";
import { revalidatePath } from "next/cache";

export const createTicket = async (
	prevState: FormState,
	formData: FormData,
) => {
	const title = formData.get("title");
	const price = formData.get("price");

	const token = cookieManager.get("session");

	try {
		await axios.post(
			"http://ticketing.dev/api/tickets",
			{ title, price },
			{ headers: { Cookie: token?.value || [] } },
		);

		revalidatePath("/my-tickets");

		return { success: true, errors: [] };
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return { success: false, errors: errors || [] };
	}
};

export const updateTicket = async (
	prevState: FormState,
	formData: FormData,
) => {
	const id = formData.get("id");
	const title = formData.get("title");
	const price = formData.get("price");

	const token = cookieManager.get("session");

	try {
		await axios.patch(
			`http://ticketing.dev/api/tickets/${id}`,
			{ title, price },
			{ headers: { Cookie: token?.value || [] } },
		);

		revalidatePath("/my-tickets");

		return { success: true, errors: [] };
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return { success: false, errors: errors || [] };
	}
};
