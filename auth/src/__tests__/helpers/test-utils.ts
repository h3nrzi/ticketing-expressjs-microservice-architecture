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
		await mongoose.connection.close();
		await mongo.stop();
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
