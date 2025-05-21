import { Message } from "node-nats-streaming";
import { BaseListener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
	readonly subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
	queueGroupName = "payments-service";

	onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
		// log the message

		console.log("Ticket created:", data);

		const { id, title, price } = data;

		// acknowledge the message

		msg.ack();
	}
}
