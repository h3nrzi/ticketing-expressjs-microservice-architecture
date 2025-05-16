import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { IUser } from "../../interfaces/user.interface";
import app from "../../app";

export const VALID_USER = {
	email: "test@test.com",
	password: "password123",
};

export const INVALID_EMAIL = "test.com";
export const INVALID_PASSWORD = "123";

export const setupTestDB = () => {
	let mongo: MongoMemoryServer;

	// Connect to the in-memory database before running tests
	beforeAll(async () => {
		// Set JWT key for testing
		process.env.JWT_KEY = "asdf";

		// Check if there's an existing connection
		if (mongoose.connection.readyState === 1) {
			return;
		}

		mongo = await MongoMemoryServer.create();
		const mongoUri = mongo.getUri();
		await mongoose.connect(mongoUri);
	});

	// Clear all data between tests
	beforeEach(async () => {
		const collections = await mongoose.connection.db.collections();
		for (let collection of collections) {
			await collection.deleteMany({});
		}
	});

	// Disconnect and stop the server after all tests
	afterAll(async () => {
		if (mongo) {
			await mongoose.connection.close();
			await mongo.stop();
		}
	});
};

export const createTestUser = async (userData: Partial<IUser> = {}) => {
	const user = {
		email: userData.email || VALID_USER.email,
		password: userData.password || VALID_USER.password,
	};

	const response = await request(app)
		.post("/api/users/signup")
		.send(user)
		.expect(201);

	return response.body;
};

// Add a simple test to satisfy Jest's requirement
describe("Test Utilities", () => {
	it("should export valid test user data", () => {
		expect(VALID_USER).toBeDefined();
		expect(VALID_USER.email).toBe("test@test.com");
		expect(VALID_USER.password).toBe("password123");
	});
});
