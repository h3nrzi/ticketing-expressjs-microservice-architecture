import nats from "node-nats-streaming";

// connect to nats
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

// listen for connection
stan.on("connect", () => {
	console.log("Publisher connected to NATS");

	// create a data to publish
	const data = JSON.stringify({
		id: "123",
		title: "concert",
		price: 20,
	});

	// publish the event
	stan.publish("ticket:created", data, () => {
		console.log("Event published");
	});
});
