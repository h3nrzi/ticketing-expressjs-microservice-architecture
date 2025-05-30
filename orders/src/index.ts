import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./config/nats-wrapper";
import { TicketUpdatedListener } from "./events/handlers/ticket-updated-listener";
import { TicketCreatedListener } from "./events/handlers/ticket-created-listener";

(async () => {
	try {
		// 1. Check if all the required environment variables are defined
		if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined!");
		if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined!");
		if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined!");
		if (!process.env.NATS_CLUSTER_ID)
			throw new Error("NATS_CLUSTER_ID must be defined!");
		if (!process.env.NATS_CLIENT_ID)
			throw new Error("NATS_CLIENT_ID must be defined!");

		// 2. Connect to NATS
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID!,
			process.env.NATS_CLIENT_ID!,
			process.env.NATS_URL!
		);

		// 3. Handle NATS connection close event
		natsWrapper.client.on("close", () => {
			console.log("NATS connection closed!");
			process.exit();
		});

		// 4. Handle NATS connection SIGINT and SIGTERM event
		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());

		// 5. Listen to ticket created event
		new TicketCreatedListener(natsWrapper.client).listen();

		// 6. Listen to ticket updated event
		new TicketUpdatedListener(natsWrapper.client).listen();

		// 7. Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Connected to MongoDB!");
	} catch (err) {
		console.error(err);
	}

	// 8. Start the server
	app.listen(3000, () => console.log("Listening on port 3000!"));
})();
