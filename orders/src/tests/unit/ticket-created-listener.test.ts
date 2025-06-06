import { TicketCreatedEvent } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../config/nats-wrapper";
import { Ticket } from "../../core/entities/ticket.entity";
import { ITicketDoc } from "../../core/interfaces/ticket.interface";
import { TicketCreatedListener } from "../../events/handlers/ticket-created-listener";

let listener: TicketCreatedListener;
let data: TicketCreatedEvent["data"];
let msg: Message;

beforeEach(async () => {
	// create an instance of the listener
	listener = new TicketCreatedListener(natsWrapper.client);

	// create a fake data event
	data = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		title: "concert",
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// create a fake message object
	msg = { ack: jest.fn() } as unknown as Message;
});

describe("TicketCreatedListener", () => {
	it("creates and saves a ticket", async () => {
		// call the onMessage function with the data and message
		await listener.onMessage(data, msg);

		// write assertions to make sure a ticket was created
		const savedTicket: ITicketDoc | null = await Ticket.findById(data.id);
		expect(savedTicket!.title).toEqual(data.title);
		expect(savedTicket!.price).toEqual(data.price);
		expect(savedTicket!.version).toEqual(data.version);
	});

	it("acks the message", async () => {
		// call the onMessage function with the data and message
		await listener.onMessage(data, msg);

		// write assertions to make sure the message was acked
		expect(msg.ack).toHaveBeenCalled();
	});
});
