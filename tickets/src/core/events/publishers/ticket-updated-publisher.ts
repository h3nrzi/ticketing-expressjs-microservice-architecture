import {
	BasePublisher,
	Subjects,
	TicketUpdatedEvent,
} from "@h3nrzi-ticket/common";
import { Stan } from "node-nats-streaming";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
	subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated; // ticket:updated

	constructor(private readonly stan: Stan) {
		super(stan);
	}
}
