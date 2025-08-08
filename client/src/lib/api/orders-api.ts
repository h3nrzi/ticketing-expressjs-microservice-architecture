import { ErrorResponse } from "@/types/ErrorResponse";
import { Order } from "@/types/Order";
import axios, { AxiosError } from "axios";
import { cookieManager } from "../utils/cookie-utils";

export async function getCurrentUserOrders() {
	const token = cookieManager.get("session");

	try {
		const res = await axios.get<Order[]>(
			"http://ticketing.dev/api/orders/currentuser",
			{
				headers: token ? { Cookie: token.value } : {},
			},
		);

		const data = res.data;

		return { data };
	} catch (error) {
		const errors = (error as AxiosError<ErrorResponse>).response?.data.errors;

		return { errors };
	}
}

export async function getOrderById(id: string) {
	const token = cookieManager.get("session");

	try {
		const res = await axios.get<Order>(
			`http://ticketing.dev/api/orders/${id}`,
			{ headers: token ? { Cookie: token.value } : {} },
		);

		const data = res.data;

		return { data };
	} catch (error) {
		const errors = (error as AxiosError<ErrorResponse>).response?.data.errors;

		return { errors };
	}
}
