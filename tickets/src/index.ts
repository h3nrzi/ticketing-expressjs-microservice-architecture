import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./config/nats";

async function startServer() {
	try {
		// Check if JWT_KEY is defined in environment variables
		if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined!");

		// Check if MONGO_URI is defined in environment variables
		if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined!");

		// Connect to NATS
		await natsWrapper.connect(
			"ticketing",
			"tickets-service",
			"http://nats-srv:4222"
		);

		// Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Connected to MongoDB!");
	} catch (err) {
		console.error(err);
	}

	// Start the server
	app.listen(3000, () => {
		console.log("Listening on port 3000!");
	});
}

startServer();
