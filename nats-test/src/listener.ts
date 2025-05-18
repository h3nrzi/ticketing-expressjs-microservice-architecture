import nats, { Message } from "node-nats-streaming";

console.clear();

// connect to nats
const stan = nats.connect("ticketing", "B", {
	url: "http://localhost:4222",
});

// listen for connection
stan.on("connect", () => {
	console.log("Listener connected to NATS");

	// subscribe to a channel
	const subscription = stan.subscribe("ticket:created");

	// listen for messages
	subscription.on("message", (msg: Message) => {
		console.log(
			"Message received:",
			msg.getSubject(), // the subject of the message
			msg.getSequence(), // the sequence of the message
			msg.getData() // the data of the message
		);
	});
});
