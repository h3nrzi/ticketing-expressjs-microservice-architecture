import {
	BaseListener,
	OrderCancelledEvent,
	OrderStatus,
	Subjects,
} from "@h3nrzi-ticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../core/entities/order.entity";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
	readonly subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
	readonly queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
		// find the order
		const order = await Order.findOne({
			_id: data.id,
			version: data.version - 1,
		});

		// if no order, throw error
		if (!order) {
			throw new Error("Order not found");
		}

		// update the order status
		order.set({ status: OrderStatus.Cancelled });

		// save the order
		await order.save();

		// ack the message
		msg.ack();
	}
}
