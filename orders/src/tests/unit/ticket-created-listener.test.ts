import { TicketCreatedEvent } from "@h3nrzi-ticket/common";
import { TicketCreatedListener } from "../../events/handlers/ticket-created-listener";
import { natsWrapper } from "../../config/nats-wrapper";
import mongoose from "mongoose";
import { Ticket } from "../../core/entities/ticket.entity";
import { Message } from "node-nats-streaming";

let listener: TicketCreatedListener;
let data: TicketCreatedEvent["data"];
let msg: Message;

beforeEach(async () => {
	// create an instance of the listener
	listener = new TicketCreatedListener(natsWrapper.client);

	// create a fake data event
	data = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 1,
		title: "concert",
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// create a fake message object
	msg = {
		ack: jest.fn(),
		getSubject: jest.fn(),
		getSequence: jest.fn(),
		getRawData: jest.fn(),
		getData: jest.fn(),
		getVersion: jest.fn(),
		getTimestamp: jest.fn(),
		getPublisher: jest.fn(),
		getTimestampRaw: jest.fn(),
		isRedelivered: jest.fn(),
		getCrc32: jest.fn(),
	} as Message;
});

it("creates and saves a ticket", async () => {
	// call the onMessage function with the data and message
	await listener.onMessage(data, msg);

	// write assertions to make sure a ticket was created
	const ticket = await Ticket.findById(data.id);
	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
	// call the onMessage function with the data and message
	await listener.onMessage(data, msg);

	// write assertions to make sure the message was acked
	expect(msg.ack).toHaveBeenCalled();
});
