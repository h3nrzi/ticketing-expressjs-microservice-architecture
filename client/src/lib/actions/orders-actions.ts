"use server";

import { ErrorResponse } from "@/types/ErrorResponse";
import { FormState } from "@/types/FormState";
import axios, { AxiosError } from "axios";
import { cookieManager } from "../utils/cookie-utils";

export const reserveTicket = async (
	prevState: FormState,
	formData: FormData
) => {
	const ticketId = formData.get("ticketId");

	const token = cookieManager.get("session");

	try {
		await axios.post(
			"http://ticketing.dev/api/orders",
			{ ticketId },
			{ headers: { Cookie: token?.value || [] } }
		);

		return { success: true, errors: [] };
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return { success: false, errors: errors || [] };
	}
};
