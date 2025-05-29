import {
	BasePublisher,
	Subjects,
	OrderCancelledEvent,
} from "@h3nrzi-ticket/common";
import { Stan } from "node-nats-streaming";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
	readonly subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;

	constructor(client: Stan) {
		super(client);
	}
}
