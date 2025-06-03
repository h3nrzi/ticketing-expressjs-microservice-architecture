import mongoose from "mongoose";
import { TicketModel } from "../../core/entities/ticket.entity";
import { natsWrapper } from "../../config/nats-wrapper";
import { ITicketDocument } from "../../core/interfaces/ticket.interface";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@h3nrzi-ticket/common";
import { OrderCancelledListener } from "../../events/handlers/order-cancelled-listener";

let listener: OrderCancelledListener;
let ticket: ITicketDocument;
let data: OrderCancelledEvent["data"];
let msg: Message;

beforeEach(async () => {
	listener = new OrderCancelledListener(natsWrapper.client);

	ticket = TicketModel.build({
		title: "concert",
		price: 100,
		userId: new mongoose.Types.ObjectId().toHexString(),
	});
	ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
	await ticket.save();

	data = {
		id: ticket.orderId!,
		version: 0,
		ticket: { id: ticket.id },
	};

	// @ts-ignore
	msg = { ack: jest.fn() };
});

describe("Positive Scenarios", () => {
	it("should mark the ticket as being reserved by setting its orderId property to null", async () => {
		await listener.onMessage(data, msg);
		const ticket = await TicketModel.findById(data.ticket.id);
		expect(ticket?.orderId).toBeNull();
	});

	it("should publish a ticket updated event", async () => {
		await listener.onMessage(data, msg);
		expect(natsWrapper.client.publish).toHaveBeenCalled();
	});

	it("should ack the message", async () => {
		await listener.onMessage(data, msg);
		expect(msg.ack).toHaveBeenCalled();
	});
});

describe("Negative Scenarios", () => {
	it("should throw an error if the ticket is not found", async () => {
		data.ticket.id = new mongoose.Types.ObjectId().toHexString();
		await expect(listener.onMessage(data, msg)).rejects.toThrow();
	});
});
