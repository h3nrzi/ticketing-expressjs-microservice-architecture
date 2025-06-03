import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./config/nats-wrapper";
import { OrderCreatedListener } from "./events/handlers/order-created-listener";
import { OrderCancelledListener } from "./events/handlers/order-cancelled-listener";

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
		new OrderCreatedListener(natsWrapper.client).listen();
		new OrderCancelledListener(natsWrapper.client).listen();

		// ====== Connect to MongoDB ======
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Connected to MongoDB!");
	} catch (err) {
		console.error(err);
	}

	// ====== Start the server ======
	app.listen(3000, () => console.log("Listening on port 3000!"));
})();
