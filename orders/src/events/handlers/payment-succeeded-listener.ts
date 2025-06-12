import {
	BaseListener,
	OrderStatus,
	Subjects,
	PaymentSucceededEvent,
} from "@h3nrzi-ticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../core/entities/order.entity";

export class PaymentSucceededListener extends BaseListener<PaymentSucceededEvent> {
	readonly subject = Subjects.PaymentSucceeded;
	readonly queueGroupName = "payments-service";

	async onMessage(data: PaymentSucceededEvent["data"], msg: Message) {
		// check for existing order, if not throw error
		const order = await Order.findById(data.id);
		if (!order) throw new Error("Order not found");

		// update order status to complete
		order.set({ status: OrderStatus.Complete });
		await order.save();

		// ack the message
		msg.ack();
	}
}
