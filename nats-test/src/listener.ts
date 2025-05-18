import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";

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
		console.log("Listener connected to NATS");

		// set the options for the subscription
		const options = stan.subscriptionOptions().setManualAckMode(true); // manually acknowledge the message

		// subscribe to a channel
		const subscription = stan.subscribe(
			"ticket:created", // the channel to subscribe to
			"orders-service-queue-group", // the name of the queue group
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
