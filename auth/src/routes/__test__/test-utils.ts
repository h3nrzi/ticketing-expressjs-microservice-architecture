import request from "supertest";
import app from "../../app";

export const VALID_USER = {
	email: "test@gmail.com",
	password: "password",
};

export const INVALID_EMAIL = "testgmail.com"; // missing @
export const INVALID_PASSWORD = "p"; // less than 4 characters

export const signupUser = async (
	email: string = VALID_USER.email,
	password: string = VALID_USER.password
) => {
	const response = await request(app)
		.post("/api/users/signup")
		.send({ email, password })
		.expect(201);

	return response.get("Set-Cookie");
};

export const signinUser = async (
	email: string = VALID_USER.email,
	password: string = VALID_USER.password
) => {
	const response = await request(app)
		.post("/api/users/signin")
		.send({ email, password })
		.expect(200);

	return response.get("Set-Cookie");
};
