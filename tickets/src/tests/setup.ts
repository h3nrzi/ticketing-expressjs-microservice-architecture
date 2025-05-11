import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import request from "supertest";

// ==========================================
// Type Definitions
// ==========================================

declare global {
	var signup: (
		email: string,
		password: string
	) => Promise<string[] | undefined>;
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

global.signup = async (email: string, password: string) => {
	// Build a JWT payload
	// Create the JWT
	// Build a session object
	// Turn the session into a JSON
	// Take JSON and encode it as base64
	// Return a string that's the cookie with the encoded data
};
