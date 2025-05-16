import request from "supertest";
import app from "../../../app";
import { setupTestDB, VALID_USER, INVALID_EMAIL, INVALID_PASSWORD } from "../../helpers/test-utils";

describe("Auth Controller Integration Tests", () => {
	setupTestDB();

	describe("POST /api/users/signup", () => {
		it("should create a new user with valid credentials", async () => {
			const response = await request(app).post("/api/users/signup").send(VALID_USER).expect(201);

			expect(response.body).toHaveProperty("id");
			expect(response.body.email).toBe(VALID_USER.email);
			expect(response.get("Set-Cookie")).toBeDefined();
		});

		it("should reject signup with invalid email", async () => {
			const response = await request(app)
				.post("/api/users/signup")
				.send({
					email: INVALID_EMAIL,
					password: VALID_USER.password,
				})
				.expect(400);

			expect(response.body.errors[0].message).toBeDefined();
		});

		it("should reject signup with invalid password", async () => {
			const response = await request(app)
				.post("/api/users/signup")
				.send({
					email: VALID_USER.email,
					password: INVALID_PASSWORD,
				})
				.expect(400);

			expect(response.body.errors[0].message).toBeDefined();
		});

		it("should reject signup with duplicate email", async () => {
			await request(app).post("/api/users/signup").send(VALID_USER).expect(201);

			const response = await request(app).post("/api/users/signup").send(VALID_USER).expect(400);

			expect(response.body.errors[0].message).toBeDefined();
		});
	});

	describe("POST /api/users/signin", () => {
		beforeEach(async () => {
			await request(app).post("/api/users/signup").send(VALID_USER).expect(201);
		});

		it("should sign in with valid credentials", async () => {
			const response = await request(app).post("/api/users/signin").send(VALID_USER).expect(200);

			expect(response.body).toHaveProperty("id");
			expect(response.body.email).toBe(VALID_USER.email);
			expect(response.get("Set-Cookie")).toBeDefined();
		});

		it("should reject signin with invalid email", async () => {
			const response = await request(app)
				.post("/api/users/signin")
				.send({
					email: "wrong@test.com",
					password: VALID_USER.password,
				})
				.expect(400);

			expect(response.body.errors[0].message).toBeDefined();
		});

		it("should reject signin with invalid password", async () => {
			const response = await request(app)
				.post("/api/users/signin")
				.send({
					email: VALID_USER.email,
					password: "wrongpassword",
				})
				.expect(400);

			expect(response.body.errors[0].message).toBeDefined();
		});
	});

	describe("GET /api/users/currentuser", () => {
		it("should return current user when authenticated", async () => {
			const signupResponse = await request(app)
				.post("/api/users/signup")
				.send(VALID_USER)
				.expect(201);

			const cookies = signupResponse.get("Set-Cookie");
			if (!cookies) {
				throw new Error("No cookies set");
			}

			const response = await request(app)
				.get("/api/users/currentuser")
				.set("Cookie", cookies)
				.expect(200);

			expect(response.body.currentUser).toBeDefined();
			expect(response.body.currentUser.email).toBe(VALID_USER.email);
		});

		it("should return null when not authenticated", async () => {
			const response = await request(app).get("/api/users/currentuser").expect(200);

			expect(response.body.currentUser).toBeNull();
		});
	});

	describe("POST /api/users/signout", () => {
		it("should clear the session cookie", async () => {
			const signupResponse = await request(app)
				.post("/api/users/signup")
				.send(VALID_USER)
				.expect(201);

			const cookies = signupResponse.get("Set-Cookie");
			if (!cookies) {
				throw new Error("No cookies set");
			}

			const response = await request(app)
				.post("/api/users/signout")
				.set("Cookie", cookies)
				.expect(200);

			const signoutCookies = response.get("Set-Cookie");
			expect(signoutCookies).toBeDefined();
			expect(signoutCookies?.[0]).toContain("session=;");
			expect(signoutCookies?.[0]).toContain("expires=Thu, 01 Jan 1970 00:00:00 GMT");
		});
	});
});
