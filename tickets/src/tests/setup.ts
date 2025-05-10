import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import request from "supertest";

// Extend the global object to include the signup function
declare global {
	var signup: (
		email: string,
		password: string
	) => Promise<string[] | undefined>;
}

// Declare a MongoMemoryServer instance
let mongo: MongoMemoryServer;

// Connect to MongoDB before all tests
beforeAll(async () => {
	process.env.JWT_KEY = "asdf";

	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

// Clear the database before each test
beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) await collection.deleteMany();
});

// Close the MongoDB and Mongoose connection after all tests
afterAll(async () => {
	if (mongo) await mongo.stop();
	await mongoose.connection.close();
});

// Helper function to signup a user
global.signup = async (email: string, password: string) => {
	// Signup a user
	const res = await request(app)
		.post("/api/users/signup")
		.send({ email, password });

	// Return the cookie
	return res.get("Set-Cookie");
};
