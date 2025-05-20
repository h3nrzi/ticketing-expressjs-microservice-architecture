import { User } from "../users/entities/user.entity";
import { signup } from "./helpers/users.helpers";

describe("Signup", () => {
	const validUser = {
		email: "test@test.com",
		password: "password123",
	};

	beforeEach(async () => {
		await User.deleteMany({});
	});

	it("returns a 201 on successful signup", async () => {
		const response = await signup(validUser).expect(201);

		expect(response.body).toHaveProperty("id");
		expect(response.body.email).toEqual(validUser.email);
		const cookie = response.get("Set-Cookie");
		expect(cookie).toBeDefined();
		if (cookie) {
			expect(cookie[0]).toMatch(/session=/);
		}
	});

	it("returns a 400 with an invalid email", async () => {
		const response = await signup({
			email: "invalid-email",
			password: "password123",
		}).expect(400);

		expect(response.body.errors).toBeDefined();
		expect(response.body.errors[0].message).toEqual("Email must be valid");
	});

	it("returns a 400 with an invalid password", async () => {
		const response = await signup({
			email: "test@test.com",
			password: "123", // too short
		}).expect(400);

		expect(response.body.errors).toBeDefined();
		expect(response.body.errors[0].message).toEqual(
			"Password must be between 4 and 20 characters"
		);
	});

	it("returns a 400 with missing email and password", async () => {
		const response = await signup({} as any).expect(400);

		expect(response.body.errors).toBeDefined();
		expect(response.body.errors.length).toBeGreaterThan(0);
	});

	it("disallows duplicate emails", async () => {
		await signup(validUser).expect(201);

		const response = await signup(validUser).expect(400);

		expect(response.body.errors).toBeDefined();
		expect(response.body.errors[0].message).toEqual("Email in use");
	});

	it("sets a cookie after successful signup", async () => {
		const response = await signup(validUser).expect(201);

		const cookie = response.get("Set-Cookie");
		expect(cookie).toBeDefined();
		if (cookie) {
			expect(cookie[0]).toMatch(/session=/);
		}
	});
});
