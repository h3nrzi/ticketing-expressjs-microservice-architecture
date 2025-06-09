import { OrderCreatedEvent, OrderStatus } from "@h3nrzi-ticket/common";
import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "./order-created-listener";
import { natsWrapper } from "../../config/nats-wrapper";
import mongoose from "mongoose";
import { Order } from "../../core/entities/order.entity";

let listener: OrderCreatedListener;
let data: OrderCreatedEvent["data"];
let msg: Message;

beforeEach(async () => {
	listener = new OrderCreatedListener(natsWrapper.client);

	// Fake data for the order created event
	data = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date().toISOString(),
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
			price: 10,
		},
	};

	// @ts-ignore
	msg = { ack: jest.fn() };
});

describe("OrderCreatedListener", () => {
	it("should create an order", async () => {
		await listener.onMessage(data, msg);
		const order = await Order.findOne({ _id: data.id });

		expect(order).toBeDefined();
		expect(order?.ticketPrice).toEqual(data.ticket.price);
		expect(order?.userId).toEqual(data.userId);
		expect(order?.status).toEqual(data.status);
		expect(order?.version).toEqual(data.version);
	});

	it("should ack the message", async () => {
		await listener.onMessage(data, msg);
		expect(msg.ack).toHaveBeenCalled();
	});
});
