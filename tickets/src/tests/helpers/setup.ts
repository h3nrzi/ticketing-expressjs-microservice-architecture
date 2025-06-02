import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// ==========================================
// Test Setup & Teardown
// ==========================================

let mongo: MongoMemoryServer;

/**
 * Connect to the in-memory MongoDB before all tests
 * This is to avoid data leakage between tests
 */
beforeAll(async () => {
	// Set JWT key for testing
	process.env.JWT_KEY = "asdf";

	// Initialize and connect to in-memory MongoDB
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri);
});

/**
 * Clear the database before each test
 * This is to avoid data leakage between tests
 */
beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) await collection.deleteMany({});
});

/**
 * Stop the in-memory MongoDB after all tests
 * This is to avoid the database being left running after all tests
 */
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

/**
 * Create a test user
 * This is a helper function to create a test user
 */
export const createTestUser = (): TestUser => ({
	id: new mongoose.Types.ObjectId().toHexString(),
	email: "test@test.com",
});

/**
 * Signup a test user
 * This is a helper function to signup a test user
 * @returns A cookie with the test user's JWT
 */
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
