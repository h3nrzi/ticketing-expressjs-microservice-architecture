import { User } from "../users/entities/user.entity";
import { signup, getCurrentUser } from "./helpers/users.helpers";

describe("Current User", () => {
	const validUser = {
		email: "test@test.com",
		password: "password123",
	};

	it("responds with null if not authenticated", async () => {
		const response = await getCurrentUser().expect(200);
		expect(response.body.currentUser).toEqual(null);
	});

	it("responds with current user if authenticated", async () => {
		// Sign up
		const signupResponse = await signup(validUser);

		const cookie = signupResponse.get("Set-Cookie");
		if (!cookie) {
			throw new Error("No cookie received from signup");
		}

		// Get current user
		const response = await getCurrentUser(cookie).expect(200);

		expect(response.body.currentUser).toBeDefined();
		expect(response.body.currentUser.email).toEqual(validUser.email);
	});

	it("responds with null if invalid cookie", async () => {
		const response = await getCurrentUser(["invalid-cookie"]).expect(200);
		expect(response.body.currentUser).toEqual(null);
	});
});
