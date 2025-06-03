import {
	BaseListener,
	OrderCancelledEvent,
	Subjects,
} from "@h3nrzi-ticket/common";
import { Message } from "node-nats-streaming";
import { TicketModel } from "../../core/entities/ticket.entity";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = "payments-service";

	async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
		// Find the ticket that the order is cancelling
		// If the ticket is not found, throw an error
		const ticket = await TicketModel.findById(data.ticket.id);
		if (!ticket) throw new Error("Ticket not found");

		// Set the orderId to undefined
		ticket.set({ orderId: undefined });

		// Save the ticket
		await ticket.save();

		// Publish a ticket updated event
		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			version: ticket.version,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			orderId: ticket.orderId,
		});

		// Ack the message
		msg.ack();
	}
}
