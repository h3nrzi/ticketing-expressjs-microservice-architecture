import mongoose from "mongoose";
import { createOrder } from "./helpers/requests";

describe("POST /api/orders", () => {
	let cookie: string[];

	beforeAll(() => {
		cookie = global.signup();
	});

	it("returns an error if the ticket does not exist", async () => {
		const ticketId = new mongoose.Types.ObjectId().toHexString();
		const res = await createOrder(ticketId, cookie);

		expect(res.status).toBe(404);
	});
});
