import { Message } from "node-nats-streaming";
import {
	Subjects,
	BaseListener,
	TicketCreatedEvent,
} from "@h3nrzi-ticket/common";
import { Ticket } from "../../core/entities/ticket.entity";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
	subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
		// get data from event
		const { id, title, price } = data;

		// create ticket
		const ticket = Ticket.build({ id, title, price });
		await ticket.save();

		// ack the message
		msg.ack();
	}
}
