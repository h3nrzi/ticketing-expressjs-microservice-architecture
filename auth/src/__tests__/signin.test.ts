import { User } from "../users/entities/user.entity";
import { signup, signin } from "./helpers/users.helpers";

describe("Signin", () => {
	const validUser = {
		email: "test@test.com",
		password: "password123",
	};

	beforeEach(async () => {
		await User.deleteMany({});
		// Create a user for testing signin
		await signup(validUser);
	});

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

	it("sets a cookie after successful signin", async () => {
		const response = await signin(validUser).expect(200);

		const cookie = response.get("Set-Cookie");
		expect(cookie).toBeDefined();
		if (cookie) {
			expect(cookie[0]).toMatch(/session=/);
		}
	});
});
