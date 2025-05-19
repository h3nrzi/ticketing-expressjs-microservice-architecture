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

		// set the options for the subscription
		const options = stan
			.subscriptionOptions()
			.setManualAckMode(true) // manually acknowledge the message
			.setDeliverAllAvailable() // deliver all messages from the beginning
			.setDurableName("listener-service"); // the name of the durable subscription

		// subscribe to a channel and listen for messages
		const subscription = stan.subscribe(
			"ticket:created", // the channel to subscribe to
			"queue-group-name", // the name of the queue group
			options // the options for the subscription
		);

		// listen for messages
		subscription.on("message", (msg: Message) => {
			console.log(
				"Message received:",
				msg.getSubject(), // the subject of the message
				msg.getSequence(), // the sequence of the message
				msg.getData() // the data of the message
			);

			// acknowledge the message
			msg.ack();
		});
	}
);

// ================================
// Handle SIGINT and SIGTERM
// ================================

// close the connection when the process is interrupted
process.on("SIGINT", () => stan.close());

// close the connection when the process is terminated
process.on("SIGTERM", () => stan.close());

abstract class Listener {
	abstract subject: string; // the subject of the message
	abstract queueGroupName: string; // the name of the queue group
	abstract onMessage(data: any, msg: Message): void; // the callback function that will be called when a message is received
	private client: Stan; // the client to connect to the NATS server
	protected ackWait = 5 * 1000; // the time to wait for an ack

	constructor(client: Stan) {
		this.client = client;
	}

	// set the options for the subscription
	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	// parse the message
	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === "string"
			? JSON.parse(data)
			: JSON.parse(data.toString("utf8"));
	}

	// listen for messages
	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on("message", (msg: Message) => {
			console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
			const parsedData = this.parseMessage(msg);
			this.onMessage(parsedData, msg);
		});
	}
}
