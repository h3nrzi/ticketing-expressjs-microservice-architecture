import { TicketUpdatedEvent } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../config/nats-wrapper";
import { Ticket } from "../../core/entities/ticket.entity";
import { ITicketDoc } from "../../core/interfaces/ticket.interface";
import { TicketUpdatedListener } from "../../events/handlers/ticket-updated-listener";

let listener: TicketUpdatedListener;
let data: TicketUpdatedEvent["data"];
let msg: Message;

beforeEach(async () => {
	// create an instance of the listener
	listener = new TicketUpdatedListener(natsWrapper.client);

	// create a ticket and save it to the database
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 10,
	});
	await ticket.save();

	// create a fake data event
	data = {
		id: ticket.id,
		version: ticket.version + 1,
		title: "new concert",
		price: 999,
		userId: new mongoose.Types.ObjectId().toHexString(),
	};

	// create a fake message object
	msg = { ack: jest.fn() } as unknown as Message;
});

describe("TicketUpdatedListener", () => {
	it("finds, updates and saves a ticket", async () => {
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

	it("it does not call ack if the event version is not the next version", async () => {
		// call the onMessage function with the data and message
		const promise = listener.onMessage({ ...data, version: 1000 }, msg);

		// write assertions to make sure the message was not acked
		await expect(promise).rejects.toThrow();
		expect(msg.ack).not.toHaveBeenCalled();
	});
});
