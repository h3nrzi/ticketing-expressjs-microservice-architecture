import { randomBytes } from "crypto";
import nats, { Message, Stan } from "node-nats-streaming";

console.clear();

// ================================
// Connect to NATS
// ================================

const stan = nats.connect(
	"ticketing", // the cluster id
	randomBytes(4).toString("hex"), // generate a random id for the listener
	{
		url: "http://localhost:4222", // the url of the nats server
	}
);

// ================================
// Listen for connection
// ================================

stan.on(
	"connect", // the event to listen for
	() => {
		// listen for the close event
		stan.on("close", () => {
			console.log("NATS connection closed!");
			process.exit();
		});

		// log the connection
		console.log("Listener connected to NATS");

		// create a new listener
		const listener = new TicketCreatedListener(stan);

		// listen for messages
		listener.listen();
	}
);

// ================================
// Handle SIGINT and SIGTERM
// ================================

// close the connection when the process is interrupted
process.on("SIGINT", () => stan.close());

// close the connection when the process is terminated
process.on("SIGTERM", () => stan.close());

// ================================
// Listener class
// ================================

abstract class Listener {
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

class TicketCreatedListener extends Listener {
	subject = "ticket:created";
	queueGroupName = "payments-service";

	// ================================
	// Handle the message
	// ================================

	onMessage(data: any, msg: Message): void {
		// log the message
		console.log("Ticket created:", data);

		// acknowledge the message
		msg.ack();
	}
}
