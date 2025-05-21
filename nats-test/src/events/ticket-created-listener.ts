import { Message } from "node-nats-streaming";
import { BaseListener } from "./base-listener";

export class TicketCreatedListener extends BaseListener {
	subject = "ticket:created";

	queueGroupName = "payments-service";

	onMessage(data: any, msg: Message): void {
		// log the message

		console.log("Ticket created:", data);

		const { id, title, price } = data;

		// acknowledge the message

		msg.ack();
	}
}
