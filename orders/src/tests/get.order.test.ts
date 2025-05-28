import mongoose from "mongoose";
import { Ticket } from "../core/entities/ticket.entity";
import { createOrder, getOrder } from "./helpers/requests";

describe("GET /api/orders/:id", () => {
	let cookie: string[];
	let otherCookie: string[];

	beforeEach(() => {
		cookie = global.signup();
		otherCookie = global.signup();
	});

	describe("validation", () => {
		it.todo("fails if the order id is not provided");

		it("fails if the order id is not a valid id", async () => {
			const res = await getOrder("123", cookie);
			expect(res.status).toBe(400);
		});
	});

	describe("authentication and authorization", () => {
		it("fails if not authenticated", async () => {
			const res = await getOrder("123", []);
			expect(res.status).toBe(401);
		});

		it("fails if the order does not belong to the user", async () => {
			const ticket = await Ticket.create({ title: "concert", price: 20 });
			const order = await createOrder({ ticketId: ticket.id }, cookie);
			const res = await getOrder(order.body.id, otherCookie);
			expect(res.status).toBe(401);
		});
	});

	describe("Business logic", () => {
		it("fails if the order does not exist", async () => {
			const id = new mongoose.Types.ObjectId().toHexString();
			const res = await getOrder(id, cookie);
			expect(res.status).toBe(404);
		});

		it("returns the order if it exists", async () => {
			const ticket = await Ticket.create({ title: "concert", price: 20 });
			const order = await createOrder({ ticketId: ticket.id }, cookie);
			const res = await getOrder(order.body.id, cookie);
			expect(res.status).toBe(200);
		});
	});
});
