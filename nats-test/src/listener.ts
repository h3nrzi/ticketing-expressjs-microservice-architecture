import nats from "node-nats-streaming";

// connect to nats
const client = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

// listen to messages
client.on("connect", () => {
	console.log("Listener connected to NATS");
});
