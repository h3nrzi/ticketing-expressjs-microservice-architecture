import { randomBytes } from "crypto";
import nats, { Message, Stan } from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";
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

		// create a new listener and listen for messages
		const listener = new TicketCreatedListener(stan);
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
