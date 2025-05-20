import { User } from "../users/entities/user.entity";
import { signup, signin } from "./helpers/users.helpers";

describe("Signin", () => {
	const validUser = {
		email: "test@test.com",
		password: "password123",
	};

	beforeEach(async () => {
		await signup(validUser);
	});

	describe("Successful Signin", () => {
		it("returns a 200 on successful signin", async () => {
			const response = await signin(validUser).expect(200);

			expect(response.body).toHaveProperty("id");
			expect(response.body.email).toEqual(validUser.email);
			const cookie = response.get("Set-Cookie");
			expect(cookie).toBeDefined();
			if (cookie) {
				expect(cookie[0]).toMatch(/session=/);
			}
		});

		it("allows multiple successful signin attempts", async () => {
			// First signin
			await signin(validUser).expect(200);

			// Second signin
			const response = await signin(validUser).expect(200);
			expect(response.body.email).toEqual(validUser.email);
		});
	});

	describe("Input Validation", () => {
		it("returns a 400 with an invalid email", async () => {
			const response = await signin({
				email: "invalid-email",
				password: "password123",
			}).expect(400);

			expect(response.body.errors).toBeDefined();
			expect(response.body.errors[0].message).toEqual("Email must be valid");
		});

		it("returns a 400 with missing email and password", async () => {
			const response = await signin({} as any).expect(400);

			expect(response.body.errors).toBeDefined();
			expect(response.body.errors.length).toBeGreaterThan(0);
		});
	});

	describe("Authentication Failures", () => {
		it("fails when a non-existent email is supplied", async () => {
			const response = await signin({
				email: "nonexistent@test.com",
				password: "password123",
			}).expect(400);

			expect(response.body.errors).toBeDefined();
			expect(response.body.errors[0].message).toEqual("Invalid credentials");
		});

		it("fails when an incorrect password is supplied", async () => {
			const response = await signin({
				email: validUser.email,
				password: "wrongpassword",
			}).expect(400);

			expect(response.body.errors).toBeDefined();
			expect(response.body.errors[0].message).toEqual("Invalid credentials");
		});
	});

	describe("Session Management", () => {
		it("sets a cookie after successful signin", async () => {
			const response = await signin(validUser).expect(200);

			const cookie = response.get("Set-Cookie");
			expect(cookie).toBeDefined();
			if (cookie) {
				expect(cookie[0]).toMatch(/session=/);
			}
		});
	});
});
