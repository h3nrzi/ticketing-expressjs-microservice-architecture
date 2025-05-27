import mongoose from "mongoose";
import { createOrder } from "./helpers/requests";

describe("POST /api/orders", () => {
	let cookie: string[];

	beforeAll(() => {
		cookie = global.signup();
	});

	describe("validation", () => {
		it.each([
			["missing", { ticketId: undefined }],
			["empty", { ticketId: "" }],
			["invalid", { ticketId: "invalid" }],
		])("fails if ticketId is %s", async (_, invalidData) => {
			const res = await createOrder(invalidData, cookie);

			expect(res.status).toBe(400);
		});
	});

	describe("authentication", () => {
		it("fails if not authenticated", async () => {
			const res = await createOrder({ ticketId: "123" }, []);
			expect(res.status).toBe(401);
		});
	});

	describe("business logic", () => {
		it("returns an error if the ticket does not exist", async () => {
			const ticketId = new mongoose.Types.ObjectId().toHexString();
			const res = await createOrder({ ticketId }, cookie);
			expect(res.status).toBe(404);
		});

		it("returns an error if the ticket is already reserved", async () => {});

		it("reserves a ticket", async () => {});
	});
});
