import {
	BasePublisher,
	Subjects,
	OrderCreatedEvent,
} from "@h3nrzi-ticket/common";
import { Stan } from "node-nats-streaming";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
	readonly subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;

	constructor(client: Stan) {
		super(client);
	}
}
