import { OrderStatus } from "@h3nrzi-ticket/common";
import { Ticket } from "../../core/entities/ticket.entity";
import { deleteOrderRequest, postOrderRequest } from "../helpers/requests";

import mongoose from "mongoose";
import { natsWrapper } from "../../config/nats-wrapper";
describe("DELETE /api/orders/:id", () => {
	let cookie: string[];
	let otherCookie: string[];

	beforeEach(() => {
		cookie = global.signup();
		otherCookie = global.signup();
	});

	describe("Validation", () => {
		it.todo("fails if the order id is not provided");

		it("fails if the order id is not a valid id", async () => {
			const res = await deleteOrderRequest("123", cookie);
			expect(res.status).toBe(400);
		});
	});

	describe("Authentication and authorization", () => {
		it("fails if not authenticated", async () => {
			const res = await deleteOrderRequest("123", []);
			expect(res.status).toBe(401);
		});

		it("fails if the order does not belong to the user", async () => {
			const ticket = await Ticket.create({ title: "concert", price: 20 });
			const order = await postOrderRequest({ ticketId: ticket.id }, cookie);
			const res = await deleteOrderRequest(order.body.id, otherCookie);
			expect(res.status).toBe(401);
		});
	});

	describe("Business logic", () => {
		it("fails if the order does not exist", async () => {
			const id = new mongoose.Types.ObjectId().toHexString();
			const res = await deleteOrderRequest(id, cookie);
			expect(res.status).toBe(404);
		});

		it("cancels the order", async () => {
			const ticket = await Ticket.create({ title: "concert", price: 20 });
			const order = await postOrderRequest({ ticketId: ticket.id }, cookie);
			const res = await deleteOrderRequest(order.body.id, cookie);
			expect(res.status).toBe(200);
			expect(res.body.status).toBe(OrderStatus.Cancelled);
		});

		it("emits an order cancelled event", async () => {
			const ticket = await Ticket.create({ title: "concert", price: 20 });
			const order = await postOrderRequest({ ticketId: ticket.id }, cookie);
			await deleteOrderRequest(order.body.id, cookie);
			expect(natsWrapper.client.publish).toHaveBeenCalled();
		});
	});
});
