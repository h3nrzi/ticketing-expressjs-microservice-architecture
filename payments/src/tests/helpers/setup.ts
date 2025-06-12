import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

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
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
	if (mongo) await mongo.stop();
	if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
});

// ==========================================
// Helper Functions
// ==========================================

declare global {
	var signup: (payload: { id: string; email: string }) => string[];
}

global.signup = (payload: { id: string; email: string }): string[] => {
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	const session = { jwt: token };
	const sessionJSON = JSON.stringify(session);
	const base64 = Buffer.from(sessionJSON).toString("base64");

	return [`session=${base64}`];
};

// ==========================================
// Mocking
// ==========================================

jest.mock("../../config/nats-wrapper", () => require("../mocks/nats-wrapper"));
jest.mock("../../stripe", () => require("../mocks/stripe"));
