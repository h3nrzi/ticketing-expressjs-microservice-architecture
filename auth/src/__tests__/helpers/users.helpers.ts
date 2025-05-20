import request from "supertest";
import app from "../../app";

interface User {
	email: string;
	password: string;
}

export const signup = ({ email, password }: User) => {
	return request(app).post("/api/users/signup").send({ email, password });
};

export const signin = ({ email, password }: User) => {
	return request(app).post("/api/users/signin").send({ email, password });
};

export const getCurrentUser = (cookie?: string[]) => {
	const req = request(app).get("/api/users/currentuser");
	if (cookie) req.set("Cookie", cookie);
	return req;
};

export const signout = (cookie?: string[]) => {
	const req = request(app).post("/api/users/signout");
	if (cookie) req.set("Cookie", cookie);
	return req;
};
