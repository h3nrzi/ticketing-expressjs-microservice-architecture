import request from "supertest";
import app from "../../app";
import { VALID_USER, INVALID_EMAIL, INVALID_PASSWORD } from "./test-utils";

describe("POST /api/users/signup", () => {
	describe("Input Validation", () => {
		describe("Invalid Email Scenarios", () => {
			it("rejects signup with malformed email", async () => {
				const res = await request(app)
					.post("/api/users/signup")
					.send({
						email: INVALID_EMAIL,
						password: VALID_USER.password,
					})
					.expect(400);

				expect(res.body.errors[0].message).toBeDefined();
			});

			it("rejects signup with missing email", async () => {
				const res = await request(app)
					.post("/api/users/signup")
					.send({
						password: VALID_USER.password,
					})
					.expect(400);

				expect(res.body.errors[0].message).toBeDefined();
			});
		});

		describe("Invalid Password Scenarios", () => {
			it("rejects signup with too short password", async () => {
				const res = await request(app)
					.post("/api/users/signup")
					.send({
						email: VALID_USER.email,
						password: INVALID_PASSWORD,
					})
					.expect(400);

				expect(res.body.errors[0].message).toBeDefined();
			});

			it("rejects signup with missing password", async () => {
				const res = await request(app)
					.post("/api/users/signup")
					.send({
						email: VALID_USER.email,
					})
					.expect(400);

				expect(res.body.errors[0].message).toBeDefined();
			});
		});

		it("rejects signup with empty request body", async () => {
			const res = await request(app)
				.post("/api/users/signup")
				.send({})
				.expect(400);

			expect(res.body.errors[0].message).toBeDefined();
			expect(res.body.errors[1].message).toBeDefined();
		});
	});

	describe("Successful Signup", () => {
		it("creates a new user with valid credentials", async () => {
			const response = await request(app)
				.post("/api/users/signup")
				.send(VALID_USER)
				.expect(201);

			expect(response.body).toHaveProperty("id");
			expect(response.body.email).toEqual(VALID_USER.email);
		});

		it("sets a cookie after successful signup", async () => {
			const res = await request(app)
				.post("/api/users/signup")
				.send(VALID_USER)
				.expect(201);

			expect(res.get("Set-Cookie")).toBeDefined();
		});
	});

	describe("Duplicate Email Prevention", () => {
		it("rejects signup with duplicate email", async () => {
			// Create first user
			await request(app).post("/api/users/signup").send(VALID_USER).expect(201);

			// Try to create user with same email
			const res = await request(app)
				.post("/api/users/signup")
				.send(VALID_USER)
				.expect(400);

			expect(res.body.errors[0].message).toBeDefined();
		});
	});
});
