import { Message, Stan } from "node-nats-streaming";
import { BaseListener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

/**
 * Listener for ticket created events
 * Handles the processing of ticket creation events from NATS
 */
export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
	/**
	 * The subject this listener is subscribed to
	 */
	readonly subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;

	/**
	 * The queue group name for this listener
	 * Used to ensure messages are only processed once per queue group
	 */
	readonly queueGroupName = "payments-service";

	/**
	 * Constructor for the TicketCreatedListener
	 * @param stan - The NATS streaming client
	 */
	constructor(stan: Stan) {
		super(stan);
	}

	/**
	 * Handles the received ticket created event
	 * @param data - The ticket creation data
	 * @param msg - The original message from NATS
	 */
	onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
		console.log("Ticket created:", data);
		console.log("Price:", data.price);

		// Acknowledge the message to prevent redelivery
		msg.ack();
	}
}
