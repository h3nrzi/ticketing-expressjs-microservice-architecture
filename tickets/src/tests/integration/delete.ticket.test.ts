import mongoose from "mongoose";
import {
	createTicket,
	deleteTicket,
	getTicket,
} from "../helpers/ticket.helpers";

describe("DELETE /api/tickets/:id", () => {
	let cookie: string[];
	let otherUserCookie: string[];
	const validTicket = { title: "Concert", price: 20 };

	beforeAll(() => {
		cookie = global.signup();
		otherUserCookie = global.signup();
	});

	describe("successful deletion", () => {
		it("deletes a ticket and verifies it's gone", async () => {
			// Create a ticket
			const createRes = await createTicket(validTicket, cookie);
			const id = createRes.body.id;

			// Delete the ticket
			const delRes = await deleteTicket(id, cookie);
			expect(delRes.status).toBe(204);

			// Verify ticket is deleted
			const getRes = await getTicket(id);
			expect(getRes.status).toBe(404);
		});
	});

	describe("authentication", () => {
		it("fails if not authenticated", async () => {
			const createRes = await createTicket(validTicket, cookie);
			const id = createRes.body.id;

			const res = await deleteTicket(id);
			expect(res.status).toBe(401);
		});

		it("fails if trying to delete another user's ticket", async () => {
			// Create ticket with first user
			const createRes = await createTicket(validTicket, cookie);
			const id = createRes.body.id;

			// Try to delete with second user
			const res = await deleteTicket(id, otherUserCookie);
			expect(res.status).toBe(401);
		});
	});

	describe("error handling", () => {
		it("returns 404 if ticket not found", async () => {
			const id = new mongoose.Types.ObjectId().toHexString();
			const res = await deleteTicket(id, cookie);
			expect(res.status).toBe(404);
		});

		it("returns 400 for invalid format id", async () => {
			const res = await deleteTicket("invalid-id", cookie);
			expect(res.status).toBe(400);
		});

		it("returns 404 for empty string id", async () => {
			const res = await deleteTicket("", cookie);
			expect(res.status).toBe(404);
		});
	});
});
