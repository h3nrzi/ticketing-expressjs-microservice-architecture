"use server";

import { ErrorResponse } from "@/types/ErrorResponse";
import { FormState } from "@/types/FormState";
import axios, { AxiosError } from "axios";
import { cookieManager } from "../utils/cookie-utils";
import { revalidatePath } from "next/cache";
import { Order } from "@/types/Order";

export const reserveTicket = async (
	prevState: FormState,
	formData: FormData
) => {
	const ticketId = formData.get("ticketId");

	const token = cookieManager.get("session");

	try {
		const res = await axios.post<Order>(
			"http://ticketing.dev/api/orders",
			{ ticketId },
			{ headers: { Cookie: token?.value || [] } }
		);

		revalidatePath("/my-tickets");
		const orderId = res.data.id;

		return {
			success: true,
			orderId,
			errors: [],
		};
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return {
			success: false,
			orderId: null,
			errors: errors || [],
		};
	}
};
