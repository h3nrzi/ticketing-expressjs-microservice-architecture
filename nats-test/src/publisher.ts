import nats from "node-nats-streaming";

// connect to nats
const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

// listen for events
stan.on("connect", () => {
	console.log("Publisher connected to NATS");
});
