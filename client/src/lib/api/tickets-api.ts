import { ErrorResponse } from "@/types/ErrorResponse";
import { Ticket } from "@/types/Ticket";
import axios, { AxiosError } from "axios";
import { cookieManager } from "../utils/cookie-utils";

export async function getCurrentUserTickets() {
	const token = cookieManager.get("session");

	try {
		const res = await axios.get(
			"http://ticketing.dev/api/tickets/currentuser",
			{ headers: token ? { Cookie: token.value } : {} },
		);

		const data = res.data as Ticket[];

		return { data };
	} catch (error) {
		const errors = (error as AxiosError<ErrorResponse>).response?.data.errors;

		return { errors };
	}
}

export async function getTicketById(id: string) {
	const token = cookieManager.get("session");

	try {
		const res = await axios.get<Ticket>(
			`http://ticketing.dev/api/tickets/${id}`,
			{ headers: token ? { Cookie: token.value } : {} },
		);

		const data = res.data;

		return { data };
	} catch (error) {
		const errors = (error as AxiosError<ErrorResponse>).response?.data.errors;

		return { errors };
	}
}
