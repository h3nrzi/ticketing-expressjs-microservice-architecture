import { signup } from "./helpers/users.helpers";

describe("Signup", () => {
	const validUser = {
		email: "test@test.com",
		password: "password123",
	};

	const createInvalidEmailUser = (email: string) => ({
		...validUser,
		email,
	});

	const createInvalidPasswordUser = (password: string) => ({
		...validUser,
		password,
	});

	const expectValidationError = (response: any, message: string) => {
		expect(response.body.errors).toBeDefined();
		expect(response.body.errors[0].message).toEqual(message);
	};

	describe("Successful signup", () => {
		it("returns a 201 on successful signup", async () => {
			const response = await signup(validUser).expect(201);

			expect(response.body).toHaveProperty("id");
			expect(response.body.email).toEqual(validUser.email);
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

	describe("Email validation", () => {
		const testCases = [
			{
				description: "invalid email format",
				email: "invalid-email",
				expectedMessage: "Email must be valid",
			},
			{
				description: "empty email",
				email: "",
				expectedMessage: "Email must be valid",
			},
			{
				description: "whitespace-only email",
				email: "   ",
				expectedMessage: "Email must be valid",
			},
			{
				description: "email exceeding maximum length",
				email: "a".repeat(255) + "@test.com",
				expectedMessage: "Email must be valid",
			},
			{
				description: "email with special characters",
				email: "test!@#$%^&*()@test.com",
				expectedMessage: "Email must be valid",
			},
		];

		testCases.forEach(({ description, email, expectedMessage }) => {
			it(`returns a 400 with ${description}`, async () => {
				const response = await signup(createInvalidEmailUser(email)).expect(
					400
				);
				expectValidationError(response, expectedMessage);
			});
		});

		it("disallows duplicate emails", async () => {
			await signup(validUser).expect(201);
			const response = await signup(validUser).expect(400);
			expectValidationError(response, "Email in use");
		});
	});

	describe("Password validation", () => {
		const testCases = [
			{
				description: "too short password",
				password: "123",
				expectedMessage: "Password must be between 4 and 20 characters",
			},
			{
				description: "empty password",
				password: "",
				expectedMessage: "Password must be between 4 and 20 characters",
			},
			{
				description: "whitespace-only password",
				password: "   ",
				expectedMessage: "Password must be between 4 and 20 characters",
			},
			{
				description: "password exceeding maximum length",
				password: "a".repeat(21),
				expectedMessage: "Password must be between 4 and 20 characters",
			},
		];

		testCases.forEach(({ description, password, expectedMessage }) => {
			it(`returns a 400 with ${description}`, async () => {
				const response = await signup(
					createInvalidPasswordUser(password)
				).expect(400);
				expectValidationError(response, expectedMessage);
			});
		});
	});

	describe("Input validation", () => {
		it("returns a 400 with missing email and password", async () => {
			const response = await signup({} as any).expect(400);
			expect(response.body.errors).toBeDefined();
			expect(response.body.errors.length).toBeGreaterThan(0);
		});
	});
});
