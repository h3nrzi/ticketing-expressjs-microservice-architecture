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
		const order = await Order.findById(data.orderId);
		if (!order) throw new Error("Order not found");

		// update order status to complete
		order.set({ status: OrderStatus.Complete });
		await order.save();

		// NOTE: We don't need to publish an order updated event here,
		// because we never gonna update the order status after it's complete

		// ack the message
		msg.ack();
	}
}
