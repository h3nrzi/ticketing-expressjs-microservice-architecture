import request from "supertest";
import app from "../../app";
import { VALID_USER, signupUser } from "./test-utils";

describe("GET /api/users/currentuser", () => {
	describe("Authentication Required (200)", () => {
		it("responds with null if not authenticated", async () => {
			const res = await request(app).get("/api/users/currentuser");

			expect(res.status).toBe(200);
			expect(res.body.currentUser).toBeNull();
		});

		it("responds with null if cookie is invalid", async () => {
			const res = await request(app)
				.get("/api/users/currentuser")
				.set("Cookie", ["session=invalid-cookie"]);

			expect(res.status).toBe(200);
			expect(res.body.currentUser).toBeNull();
		});
	});

	describe("Successful Authentication (200)", () => {
		it("responds with current user details if authenticated", async () => {
			// Sign up a user and get the cookie
			const cookie = await signupUser();

			// Make request to current-user endpoint with the cookie
			const res = await request(app)
				.get("/api/users/currentuser")
				.set("Cookie", cookie!);

			expect(res.body.currentUser);
			expect(res.body.currentUser.email).toEqual(VALID_USER.email);
			expect(res.body.currentUser.id);
		});
	});
});
