import { OrderCancelledEvent, OrderStatus } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { Order } from "../../core/entities/order.entity";
import { OrderCancelledListener } from "./order-cancelled-listener";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../config/nats-wrapper";
import { IOrderDoc } from "../../core/interfaces/order.interface";

let listener: OrderCancelledListener;
let order: IOrderDoc;
let data: OrderCancelledEvent["data"];
let msg: Message;

beforeEach(async () => {
	listener = new OrderCancelledListener(natsWrapper.client);

	// create a new order with version 0 and save it
	order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		ticketPrice: 10,
	});
	await order.save();

	// fake order cancelled event data that will be sent to the listener
	data = {
		id: order.id,
		version: order.version + 1,
		ticket: { id: new mongoose.Types.ObjectId().toHexString() },
	};

	// @ts-ignore
	msg = { ack: jest.fn() };
});

describe("OrderCancelledListener", () => {
	it("should update the order", async () => {
		await listener.onMessage(data, msg);
		const updatedOrder = await Order.findById(order.id);
		expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
		expect(updatedOrder?.version).toEqual(data.version);
	});

	it("should ack the message", async () => {
		await listener.onMessage(data, msg);
		expect(msg.ack).toHaveBeenCalled();
	});
});
