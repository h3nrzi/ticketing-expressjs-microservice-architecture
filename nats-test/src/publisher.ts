import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// ================================
// Connect to NATS
// ================================

const stan = nats.connect(
	"ticketing", // the cluster id
	"ABC", // the client id
	{
		url: "http://localhost:4222", // the url of the nats server
	}
);

// ================================
// Listen for connection
// ================================

stan.on("connect", async () => {
	console.log("Publisher connected to NATS");

	// create a data to publish
	const data = {
		id: "123",
		title: "concert",
		price: 20,
	};

	// publish the event
	const publisher = new TicketCreatedPublisher(stan);

	try {
		await publisher.publish(data);
	} catch (err) {
		console.log(err);
	}
});
