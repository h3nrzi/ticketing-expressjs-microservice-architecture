import { Stan } from "node-nats-streaming";
import { BasePublisher } from "./base-publisher";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
	subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;

	constructor(client: Stan) {
		super(client);
	}
}
