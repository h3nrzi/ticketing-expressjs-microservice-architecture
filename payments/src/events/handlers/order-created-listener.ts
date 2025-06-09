import {
	BaseListener,
	OrderCreatedEvent,
	Subjects,
} from "@h3nrzi-ticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../core/entities/order.entity";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
	readonly subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
	readonly queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		// create a new order
		const order = Order.build({
			id: data.id,
			ticketPrice: data.ticket.price,
			userId: data.userId,
			status: data.status,
			version: data.version,
		});

		// save the order
		await order.save();

		// ack the message
		msg.ack();
	}
}
