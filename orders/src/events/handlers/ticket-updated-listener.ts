import { Message } from "node-nats-streaming";
import {
	Subjects,
	BaseListener,
	TicketUpdatedEvent,
	NotFoundError,
} from "@h3nrzi-ticket/common";
import { Ticket } from "../../core/entities/ticket.entity";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
	subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		// get data from event
		const { id, title, price } = data;

		// find ticket, if not found, throw error
		const ticket = await Ticket.findById(id);
		if (!ticket) throw new NotFoundError("Ticket not found");

		// update ticket
		ticket.set({ title, price });
		await ticket.save();

		// ack the message
		msg.ack();
	}
}
