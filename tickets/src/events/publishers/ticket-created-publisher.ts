import {
	BasePublisher,
	Subjects,
	TicketCreatedEvent,
} from "@h3nrzi-ticket/common";
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
	subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated; // ticket:created

	constructor(private readonly stan: Stan) {
		super(stan);
	}
}
