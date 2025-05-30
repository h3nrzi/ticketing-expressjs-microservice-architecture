import {
	BaseListener,
	Subjects,
	TicketUpdatedEvent,
} from "@h3nrzi-ticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../core/entities/ticket.entity";
import { queueGroupName } from "./queue-group-name";
import { ITicketDoc } from "../../core/interfaces/ticket.interface";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
	subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		// get data from event
		const { id, title, price, version } = data;

		// find ticket, if not found, throw error
		const ticket: ITicketDoc | null = await Ticket.findByEvent({ id, version });
		if (!ticket) throw new Error("Ticket not found");

		// update ticket
		ticket.set({ title, price });
		await ticket.save();

		// ack the message
		msg.ack();
	}
}
