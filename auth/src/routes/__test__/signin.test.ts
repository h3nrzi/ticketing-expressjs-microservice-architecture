import request from "supertest";
import app from "../../app";
import {
	VALID_USER,
	INVALID_EMAIL,
	INVALID_PASSWORD,
	signupUser,
} from "./test-utils";

describe("POST /api/users/signin", () => {
	describe("Bad Request Errors (400)", () => {
		describe("Input Validation", () => {
			it("fails if email is missing", async () => {
				const res = await request(app).post("/api/users/signin").send({
					password: VALID_USER.password,
				});

				expect(res.status).toBe(400);
				expect(res.body.errors);
			});

			it("fails if password is missing", async () => {
				const res = await request(app).post("/api/users/signin").send({
					email: VALID_USER.email,
				});

				expect(res.status).toBe(400);
				expect(res.body.errors);
			});
		});

		describe("Invalid Credentials", () => {
			it("fails if email is invalid", async () => {
				// Sign up a user
				await signupUser();

				// Signin user with invalid email
				const res = await request(app).post("/api/users/signin").send({
					email: INVALID_EMAIL,
					password: VALID_USER.password,
				});

				expect(res.status).toBe(400);
				expect(res.body.errors);
			});

			it("fails if password is invalid", async () => {
				// Sign up a user
				await signupUser();

				// Signin user with invalid password
				const res = await request(app).post("/api/users/signin").send({
					email: VALID_USER.email,
					password: INVALID_PASSWORD,
				});

				expect(res.status).toBe(400);
				expect(res.body.errors);
			});
		});
	});

	describe("Not Found Errors (404)", () => {
		it("fails if user not found", async () => {
			const res = await request(app).post("/api/users/signin").send({
				email: "nonexistent@gmail.com",
				password: VALID_USER.password,
			});

			expect(res.status).toBe(404);
			expect(res.body.errors);
		});
	});

	describe("Successful Signin (200)", () => {
		it("responds with cookie and user details, if user exists", async () => {
			// Sign up a user
			await signupUser();

			// Signin user
			const res = await request(app).post("/api/users/signin").send(VALID_USER);

			expect(res.status).toBe(200);
			expect(res.get("Set-Cookie"));
			expect(res.body.id);
			expect(res.body.email).toBe(VALID_USER.email);
		});
	});
});
