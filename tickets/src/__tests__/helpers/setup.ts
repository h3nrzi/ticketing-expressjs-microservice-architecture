import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// ==========================================
// Type Definitions
// ==========================================

export interface TestUser {
	id: string;
	email: string;
}

declare global {
	var signup: () => string[];
	var createTestUser: () => TestUser;
}

// ==========================================
// Test Setup & Teardown
// ==========================================

let mongo: MongoMemoryServer;

export const setupTestDB = async () => {
	// Set JWT key for testing
	process.env.JWT_KEY = "asdf";

	// Initialize and connect to in-memory MongoDB
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri);
};

export const clearDatabase = async () => {
	if (!mongoose.connection.db) {
		throw new Error("MongoDB connection not established");
	}
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) await collection.deleteMany();
};

export const teardownTestDB = async () => {
	if (mongo) await mongo.stop();
	if (mongoose.connection.readyState !== 0) {
		await mongoose.connection.close();
	}
};

// ==========================================
// Helper Functions
// ==========================================

export const createTestUser = (): TestUser => ({
	id: new mongoose.Types.ObjectId().toHexString(),
	email: "test@test.com",
});

global.createTestUser = createTestUser;

global.signup = () => {
	const payload = createTestUser();
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	const session = { jwt: token };
	const sessionJSON = JSON.stringify(session);
	const base64 = Buffer.from(sessionJSON).toString("base64");
	return [`session=${base64}`];
};

// ==========================================
// Jest Setup
// ==========================================

beforeAll(async () => {
	await setupTestDB();
});

beforeEach(async () => {
	await clearDatabase();
});

afterAll(async () => {
	await teardownTestDB();
});
