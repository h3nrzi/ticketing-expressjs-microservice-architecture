import { OrderStatus, PaymentSucceededEvent } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../config/nats-wrapper";
import { PaymentSucceededListener } from "../../events/handlers/payment-succeeded-listener";
import { Order } from "../../core/entities/order.entity";
import { Ticket } from "../../core/entities/ticket.entity";
import { IOrderDoc } from "../../core/interfaces/order.interface";

let listener: PaymentSucceededListener;
let paymentSucceededEventData: PaymentSucceededEvent["data"];
let msg: Message;
let savedOrder: IOrderDoc;

beforeEach(async () => {
	// create an instance of the listener
	listener = new PaymentSucceededListener(natsWrapper.client);

	// create a fake ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 10,
	});
	await ticket.save();

	// create a fake order
	const order = Order.build({
		userId: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket,
	});
	savedOrder = await order.save();

	// create a fake data event, that is representing a payment for an order
	paymentSucceededEventData = {
		id: new mongoose.Types.ObjectId().toHexString(),
		orderId: savedOrder.id,
		stripeId: "stripeId",
	};

	// create a fake message object
	msg = { ack: jest.fn() } as unknown as Message;
});

describe("PaymentSucceededListener", () => {
	it("should throw an error if the order is not found", async () => {
		paymentSucceededEventData.orderId =
			new mongoose.Types.ObjectId().toHexString();
		const promise = listener.onMessage(paymentSucceededEventData, msg);
		await expect(promise).rejects.toThrow();
	});

	it("should update the order status to complete", async () => {
		await listener.onMessage(paymentSucceededEventData, msg);
		const updatedOrder = await Order.findById(savedOrder.id);
		expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
		expect(msg.ack).toHaveBeenCalled();
	});

	it("should ack the message", async () => {
		await listener.onMessage(paymentSucceededEventData, msg);
		expect(msg.ack).toHaveBeenCalled();
	});
});
