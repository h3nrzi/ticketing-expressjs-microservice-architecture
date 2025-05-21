import { Message, Stan } from "node-nats-streaming";

export abstract class BaseListener {
	abstract subject: string;
	abstract queueGroupName: string;
	abstract onMessage(data: any, msg: Message): void;
	protected readonly ackWait = 5 * 1000;

	constructor(private readonly client: Stan) {}

	// ================================
	// Set the options for the subscription
	// ================================

	subscriptionOptions() {
		return this.client
			.subscriptionOptions() // get the subscription options
			.setDeliverAllAvailable() // deliver all messages from the beginning
			.setManualAckMode(true) // manually acknowledge the message
			.setAckWait(this.ackWait) // the time to wait for an ack
			.setDurableName(this.queueGroupName); // the name of the durable subscription
	}

	// ================================
	// Parse the message
	// ================================

	parseMessage(msg: Message) {
		// get the data from the message
		const data = msg.getData();

		// return the parsed message
		return typeof data === "string"
			? JSON.parse(data)
			: JSON.parse(data.toString("utf8"));
	}

	// ================================
	// Listen for messages
	// ================================

	listen() {
		// subscribe to the subject
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		// listen for messages
		subscription.on("message", (msg: Message) => {
			console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
			const parsedData = this.parseMessage(msg);
			this.onMessage(parsedData, msg);
		});
	}
}
