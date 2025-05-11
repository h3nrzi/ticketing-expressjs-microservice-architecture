import request from "supertest";
import app from "../../app";
import { signupUser } from "./test-utils";

describe("POST /api/users/signout", () => {
	describe("Successful Signout (204)", () => {
		it("clears the cookie after signing out", async () => {
			// Signup user
			await signupUser();

			// Signout user
			const res = await request(app).post("/api/users/signout").send({});

			expect(res.status).toBe(204);
			expect(res.get("Set-Cookie")![0]).toMatch(/session=;/);
		});
	});
});
