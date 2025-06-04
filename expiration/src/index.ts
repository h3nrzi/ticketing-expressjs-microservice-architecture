import { natsWrapper } from "./config/nats-wrapper";

(async () => {
	try {
		// ====== Required environment variables ======
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
	} catch (err) {
		console.error(err);
	}

	// app.listen(3000, () => console.log("Listening on port 3000!"));
	console.log("Expiration service is running!");
})();
