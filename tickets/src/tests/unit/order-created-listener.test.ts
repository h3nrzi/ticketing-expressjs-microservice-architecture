import { OrderCreatedEvent } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "../../events/handlers/order-created-listener";
import { natsWrapper } from "../../config/nats-wrapper";
import { TicketModel } from "../../core/entities/ticket.entity";
import { ITicketDocument } from "../../core/interfaces/ticket.interface";

let listener: OrderCreatedListener;
let ticket: ITicketDocument;
let data: OrderCreatedEvent["data"];
let msg: Message;

beforeEach(async () => {
	listener = new OrderCreatedListener(natsWrapper.client);

	ticket = TicketModel.build({
		title: "concert",
		price: 100,
		userId: new mongoose.Types.ObjectId().toHexString(),
	});
	await ticket.save();

	// @ts-ignore
	data = {
		id: new mongoose.Types.ObjectId().toHexString(),
		ticket: { id: ticket.id, price: ticket.price },
	};

	// @ts-ignore
	msg = { ack: jest.fn() };
});

describe("Positive Scenarios", () => {
	it("should ack the message", async () => {
		await listener.onMessage(data, msg);
		expect(msg.ack).toHaveBeenCalled();
	});

	it("should mark the ticket as being reserved by setting its orderId property", async () => {
		await listener.onMessage(data, msg);
		const ticket = await TicketModel.findById(data.ticket.id);
		expect(ticket?.orderId).toEqual(data.id);
	});
});

describe("Negative Scenarios", () => {
	it("should throw an error if the ticket is not found", async () => {
		data.ticket.id = new mongoose.Types.ObjectId().toHexString();
		await expect(listener.onMessage(data, msg)).rejects.toThrow();
	});
});
