import mongoose from "mongoose";
import { createTicket, updateTicket } from "./helpers/ticket.helpers";

describe("PATCH /api/tickets/:id", () => {
	let cookie: string[];

	beforeAll(() => {
		cookie = global.signup();
	});

	it("updates a ticket", async () => {
		const createRes = await createTicket(
			{ title: "Concert", price: 20 },
			cookie
		);
		const id = createRes.body.id;

		const res = await updateTicket(
			id,
			{ title: "Updated Concert", price: 30 },
			cookie
		);

		expect(res.status).toBe(200);
		expect(res.body.title).toBe("Updated Concert");
		expect(res.body.price).toBe(30);
	});

	it("fails if not authenticated", async () => {
		const createRes = await createTicket(
			{ title: "Concert", price: 20 },
			cookie
		);
		const id = createRes.body.id;

		const res = await updateTicket(id, { title: "Updated Concert", price: 30 });
		expect(res.status).toBe(401);
	});

	it("returns 404 if ticket not found", async () => {
		const id = new mongoose.Types.ObjectId().toHexString();
		const res = await updateTicket(
			id,
			{ title: "Updated Concert", price: 30 },
			cookie
		);
		expect(res.status).toBe(404);
	});
});
