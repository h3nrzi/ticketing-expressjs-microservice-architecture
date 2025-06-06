import mongoose from "mongoose";
import { natsWrapper } from "../../config/nats-wrapper";
import { ExpirationCompleteListener } from "../../events/handlers/expiration-complete-listener";
import { ExpirationCompleteEvent, OrderStatus } from "@h3nrzi-ticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../core/entities/order.entity";
import { Ticket } from "../../core/entities/ticket.entity";
import { IOrderDoc } from "../../core/interfaces/order.interface";

let listener: ExpirationCompleteListener;
let data: ExpirationCompleteEvent["data"];
let msg: Message;
let order: IOrderDoc;

beforeEach(async () => {
	// create an instance of the listener
	listener = new ExpirationCompleteListener(natsWrapper.client);

	// create a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 10,
	});
	await ticket.save();

	// create an order
	order = Order.build({
		ticket,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date(Date.now() + 3000), // 3 seconds from now
		status: OrderStatus.Created,
	});
	await order.save();

	// create a fake data event
	data = { orderId: order.id };

	// create a fake message object
	msg = {
		ack: jest.fn(),
	} as unknown as Message;
});

describe("ExpirationCompleteListener", () => {
	it("should update the order status to cancelled", async () => {
		await listener.onMessage(data, msg);
		const updatedOrder = await Order.findById(order.id);
		expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
	});

	it("should publish an order cancelled event", async () => {
		await listener.onMessage(data, msg);
		expect(natsWrapper.client.publish).toHaveBeenCalled();
	});

	it("should ack the message", async () => {
		await listener.onMessage(data, msg);
		expect(msg.ack).toHaveBeenCalled();
	});

	it("should throw an error if the order is not found", async () => {
		const orderId = new mongoose.Types.ObjectId().toHexString();
		const promise = listener.onMessage({ orderId }, msg);
		await expect(promise).rejects.toThrow();
	});

	it("should not publish an order cancelled event if the order is completed or cancelled", async () => {
		order.status = OrderStatus.Complete;
		await order.save();
		await listener.onMessage(data, msg);
		expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);

		order.status = OrderStatus.Cancelled;
		await order.save();
		await listener.onMessage(data, msg);
		expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);
	});
});
