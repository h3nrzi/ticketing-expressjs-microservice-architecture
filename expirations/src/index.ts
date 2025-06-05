import { natsWrapper } from "./config/nats-wrapper";
import { OrderCreatedListener } from "./events/handlers/order-created-listener";

(async () => {
	try {
		// ====== Required environment variables ======
		if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined!");
		if (!process.env.NATS_CLUSTER_ID)
			throw new Error("NATS_CLUSTER_ID must be defined!");
		if (!process.env.NATS_CLIENT_ID)
			throw new Error("NATS_CLIENT_ID must be defined!");
		if (!process.env.REDIS_HOST) throw new Error("REDIS_HOST must be defined!");
		if (!process.env.REDIS_PORT) throw new Error("REDIS_PORT must be defined!");

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
	} catch (err) {
		console.error(err);
	}

	console.log("Expiration service is running!");
})();
