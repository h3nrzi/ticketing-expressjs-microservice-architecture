import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// ==========================================
// Type Definitions
// ==========================================

declare global {
	var signup: () => string[];
}

// ==========================================
// Test Setup & Teardown
// ==========================================

let mongo: MongoMemoryServer;

beforeAll(async () => {
	// Set JWT key for testing
	process.env.JWT_KEY = "asdf";

	// Initialize and connect to in-memory MongoDB
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	// Get all collections
	const collections = await mongoose.connection.db.collections();

	// Delete all documents in each collection
	for (let collection of collections) await collection.deleteMany();
});

afterAll(async () => {
	// Stop the in-memory MongoDB instance
	if (mongo) await mongo.stop();

	// Close the Mongoose connection
	await mongoose.connection.close();
});

// ==========================================
// Helper Functions
// ==========================================

global.signup = () => {
	// Build a JWT payload
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: "test@test.com",
	};

	// Create the JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build a session object
	const session = { jwt: token };

	// Turn the session into a JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");

	// Return a string that's the cookie with the encoded data
	return [`session=${base64}`];
};
