import {
	BaseListener,
	ExpirationCompleteEvent,
	OrderStatus,
	Subjects,
} from "@h3nrzi-ticket/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../core/entities/order.entity";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
	readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
	readonly queueGroupName = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
		// find the order, if not found, throw an error
		const order = await Order.findById(data.orderId).populate("ticket");
		if (!order) {
			throw new Error("Order not found");
		}

		// if the order is complete or cancelled, ack the message
		if (
			order.status === OrderStatus.Complete ||
			order.status === OrderStatus.Cancelled
		) {
			return msg.ack();
		}

		// Mark the order as cancelled
		order.set({
			status: OrderStatus.Cancelled,
			ticket: null,
		});

		// save the order
		await order.save();

		// emit the order cancelled event
		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id,
			},
		});

		// ack the message
		msg.ack();
	}
}
