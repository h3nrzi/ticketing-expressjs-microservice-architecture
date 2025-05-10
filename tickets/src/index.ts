import mongoose from "mongoose";
import app from "./app";

async function startServer() {
	try {
		// Check if JWT_KEY is defined in environment variables
		if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined!");

		// Connect to MongoDB
		await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets");
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
