import { User } from "../users/entities/user.entity";
import { signup, signin, signout } from "./helpers/users.helpers";

describe("Signout", () => {
	const validUser = {
		email: "test@test.com",
		password: "password123",
	};

	describe("Cookie Management", () => {
		it("clears the cookie after signing out", async () => {
			// First sign up
			await signup(validUser);

			// Then sign in
			const signinResponse = await signin(validUser);

			// Get the cookie from signin
			const cookie = signinResponse.get("Set-Cookie");
			if (!cookie) {
				throw new Error("No cookie received from signin");
			}

			// Sign out
			const response = await signout(cookie).expect(200);

			// Check that the cookie is cleared
			const clearedCookie = response.get("Set-Cookie");
			expect(clearedCookie).toBeDefined();
			if (clearedCookie) {
				expect(clearedCookie[0]).toEqual(
					"session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
				);
			}
		});

		it("clears session after signing out", async () => {
			await signup(validUser);
			const signinResponse = await signin(validUser);
			const cookie = signinResponse.get("Set-Cookie");

			// First verify we have a session
			expect(cookie).toBeDefined();
			if (!cookie) {
				throw new Error("No cookie received from signin");
			}
			expect(cookie[0]).toContain("session=");

			// Sign out
			const response = await signout(cookie).expect(200);

			// Verify session is cleared
			const clearedCookie = response.get("Set-Cookie");
			expect(clearedCookie).toBeDefined();
			if (!clearedCookie) {
				throw new Error("No cookie received from signout");
			}
			expect(clearedCookie[0]).toContain("session=");
			expect(clearedCookie[0]).toContain(
				"expires=Thu, 01 Jan 1970 00:00:00 GMT"
			);
		});
	});

	describe("Response Handling", () => {
		it("returns empty object in response body", async () => {
			await signup(validUser);
			const signinResponse = await signin(validUser);
			const cookie = signinResponse.get("Set-Cookie");

			const response = await signout(cookie).expect(200);
			expect(response.body).toEqual({});
		});

		it("returns 200 even if no cookie is present", async () => {
			const response = await signout().expect(200);
			expect(response.body).toEqual({});
		});
	});

	describe("Edge Cases", () => {
		it("handles multiple signout requests", async () => {
			await signup(validUser);
			const signinResponse = await signin(validUser);
			const cookie = signinResponse.get("Set-Cookie");

			if (!cookie) {
				throw new Error("No cookie received from signin");
			}

			// First signout
			await signout(cookie).expect(200);

			// Second signout should still work
			const response = await signout(cookie).expect(200);
			expect(response.body).toEqual({});
		});
	});
});
