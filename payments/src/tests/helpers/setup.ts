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
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.close();
	}
});

// ==========================================
// Helper Functions
// ==========================================

export interface TestUser {
	id: string;
	email: string;
}

declare global {
	var signup: () => string[];
	var createTestUser: () => TestUser;
}

export const createTestUser = (): TestUser => ({
	id: new mongoose.Types.ObjectId().toHexString(),
	email: "test@test.com",
});

global.signup = (): string[] => {
	const payload = createTestUser();
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	const session = { jwt: token };
	const sessionJSON = JSON.stringify(session);
	const base64 = Buffer.from(sessionJSON).toString("base64");
	return [`session=${base64}`];
};

// ==========================================
// Mocking
// ==========================================

/**
 * Mock the nats wrapper
 * This is to avoid the nats wrapper being called during tests
 */
jest.mock("../../config/nats-wrapper", () => require("../mocks/nats-wrapper"));
