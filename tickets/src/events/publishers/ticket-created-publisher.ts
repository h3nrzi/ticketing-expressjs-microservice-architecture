import {
	BasePublisher,
	Subjects,
	TicketCreatedEvent,
} from "@h3nrzi-ticket/common/build/events";
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
	/**
	 * @description The subject of the ticket created event
	 * @implements implements the subject of the ticket created event
	 */
	subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated; // ticket:created

	/**
	 * @description The constructor of the ticket created publisher
	 * @param stan - The stan instance
	 */
	constructor(private readonly stan: Stan) {
		super(stan);
	}
}
