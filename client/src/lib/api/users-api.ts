import axios, { AxiosError } from "axios";
import { cookieManager } from "../utils/cookie-utils";
import { ErrorResponse } from "@/types/ErrorResponse";
import { User } from "@/types/User";

export async function getCurrentUser() {
	const token = cookieManager.get("session");

	try {
		const res = await axios.get<{ currentUser: User }>(
			"http://ticketing.dev/api/users/currentuser",
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
