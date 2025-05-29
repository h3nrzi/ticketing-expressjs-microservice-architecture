import { Message } from "node-nats-streaming";
import {
	Subjects,
	BaseListener,
	TicketCreatedEvent,
} from "@h3nrzi-ticket/common";
import { Ticket } from "../../core/entities/ticket.entity";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
	subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
	queueGroupName = "orders-service";

	async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
		const { id, title, price } = data;

		const ticket = Ticket.build({ id, title, price });
		await ticket.save();

		msg.ack();
	}
}
