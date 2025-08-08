"use server";

import { ErrorResponse } from "@/types/ErrorResponse";
import axios, { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { cookieManager } from "../utils/cookie-utils";

export const createPayment = async (orderId: string, stripeToken: string) => {
	const token = cookieManager.get("session");

	try {
		await axios.post(
			"http://ticketing.dev/api/payments",
			{
				orderId,
				token: stripeToken,
			},
			{
				headers: {
					Cookie: token?.value || [],
				},
			},
		);

		revalidatePath("/orders");

		return { success: true, errors: [] };
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return { success: false, errors: errors || [] };
	}
};
