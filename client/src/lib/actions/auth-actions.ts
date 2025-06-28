"use server";

import { ErrorResponse } from "@/types/ErrorResponse";
import { FormState } from "@/types/FormState";
import axios, { AxiosError } from "axios";
import { cookieManager } from "../utils/cookie-utils";

export const signUp = async (prevState: FormState, formData: FormData) => {
	const email = formData.get("email");
	const password = formData.get("password");

	try {
		const res = await axios.post("http://ticketing.dev/api/users/signup", {
			email,
			password,
		});

		const sessionCookie = res.headers["set-cookie"]?.[0];
		if (sessionCookie) cookieManager.set("session", sessionCookie);

		return { success: true, errors: [] };
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return { success: false, errors: errors || [] };
	}
};

export const signin = async (prevState: FormState, formData: FormData) => {
	const email = formData.get("email");
	const password = formData.get("password");

	try {
		const res = await axios.post("http://ticketing.dev/api/users/signin", {
			email,
			password,
		});

		const sessionCookie = res.headers["set-cookie"]?.[0];
		if (sessionCookie) cookieManager.set("session", sessionCookie);

		return { success: true, errors: [] };
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return { success: false, errors: errors || [] };
	}
};

export const signout = async () => {
	try {
		await axios.post("http://ticketing.dev/api/users/signout", {
			withCredentials: true,
		});

		cookieManager.delete("session");

		return { success: true, errors: [] };
	} catch (err) {
		const errors = (err as AxiosError<ErrorResponse>).response?.data.errors;

		return { success: false, errors: errors || [] };
	}
};
