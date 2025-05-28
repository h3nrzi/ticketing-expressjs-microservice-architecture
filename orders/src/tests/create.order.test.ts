import mongoose from "mongoose";
import { Ticket } from "../core/entities/ticket.entity";
import { postOrderRequest } from "./helpers/requests";

describe("POST /api/orders", () => {
	let cookie: string[];
	let otherCookie: string[];

	beforeAll(() => {
		cookie = global.signup();
		otherCookie = global.signup();
	});

	describe("validation", () => {
		it.each([
			["missing", { ticketId: undefined }],
			["empty", { ticketId: "" }],
			["invalid", { ticketId: "invalid" }],
		])("fails if ticketId is %s", async (_, invalidData) => {
			const res = await postOrderRequest(invalidData, cookie);
			expect(res.status).toBe(400);
		});
	});

	describe("authentication", () => {
		it("fails if not authenticated", async () => {
			const res = await postOrderRequest({ ticketId: "123" }, []);
			expect(res.status).toBe(401);
		});
	});

	describe("business logic", () => {
		it("returns an error if the ticket does not exist", async () => {
			const ticketId = new mongoose.Types.ObjectId().toHexString();
			const res = await postOrderRequest({ ticketId }, cookie);
			expect(res.status).toBe(404);
		});

		it("returns an error if the ticket is already reserved", async () => {
			// Create a ticket and reserve it
			const ticket = await Ticket.create({ title: "concert", price: 20 });
			await postOrderRequest({ ticketId: ticket.id }, cookie);

			// Try to reserve the ticket again
			const res = await postOrderRequest({ ticketId: ticket.id }, otherCookie);

			expect(res.status).toBe(400);
		});

		it("reserves a ticket", async () => {
			// Create a ticket
			const ticket = await Ticket.create({ title: "concert", price: 20 });

			// Reserve the ticket
			const res = await postOrderRequest({ ticketId: ticket.id }, cookie);

			expect(res.status).toBe(201);
			expect(res.body.ticket.id).toEqual(ticket.id);
		});

		it.todo("emits an order created event");
	});
});
