import mongoose from "mongoose";
import { createTicket, getTicket } from "../helpers/ticket.helpers";

describe("GET /api/tickets/:id", () => {
	let cookie: string[];

	beforeAll(() => {
		cookie = global.signup();
	});

	it("returns a ticket by id", async () => {
		const createRes = await createTicket(
			{ title: "Concert", price: 20 },
			cookie
		);
		const id = createRes.body.id;

		const res = await getTicket(id);

		expect(res.status).toBe(200);
		expect(res.body.title).toBe("Concert");
		expect(res.body.price).toBe(20);
	});

	it("returns 404 if ticket not found", async () => {
		const id = new mongoose.Types.ObjectId().toHexString();
		const res = await getTicket(id);
		expect(res.status).toBe(404);
	});
});
