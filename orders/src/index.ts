import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./config/nats-wrapper";
import { TicketUpdatedListener } from "./events/handlers/ticket-updated-listener";
import { TicketCreatedListener } from "./events/handlers/ticket-created-listener";
import { ExpirationCompleteListener } from "./events/handlers/expiration-complete-listener";

(async () => {
	try {
		// ====== Required environment variables ======
		if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined!");
		if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined!");
		if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined!");
		if (!process.env.NATS_CLUSTER_ID)
			throw new Error("NATS_CLUSTER_ID must be defined!");
		if (!process.env.NATS_CLIENT_ID)
			throw new Error("NATS_CLIENT_ID must be defined!");

		// ====== Connect to NATS ======
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID!,
			process.env.NATS_CLIENT_ID!,
			process.env.NATS_URL!
		);

		// ====== Handle NATS connection close event ======
		natsWrapper.client.on("close", () => {
			console.log("NATS connection closed!");
			process.exit();
		});

		// ====== Handle NATS connection SIGINT and SIGTERM event ======
		process.on("SIGINT", () => natsWrapper.client.close());
		process.on("SIGTERM", () => natsWrapper.client.close());

		// ====== Event Listeners ======
		new TicketCreatedListener(natsWrapper.client).listen();
		new TicketUpdatedListener(natsWrapper.client).listen();
		new ExpirationCompleteListener(natsWrapper.client).listen();

		// ====== Connect to MongoDB ======
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Connected to MongoDB!");
	} catch (err) {
		console.error(err);
	}

	// 8. Start the server
	app.listen(3000, () => console.log("Listening on port 3000!"));
})();
