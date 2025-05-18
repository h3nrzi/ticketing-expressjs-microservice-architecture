import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it("returns 404 if the ticket is not found", async () => {
	// Get a ticket that doesn't exist and expect a 404
	await request(app)
		.get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
		.expect(404);
});

it("returns the ticket if it is found", async () => {
	// Create a ticket and expect a 201
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ title: "test title", price: 10 })
		.expect(201);

	// Get the ticket and expect a 200
	const res2 = await request(app)
		.get(`/api/tickets/${res.body.id}`)
		.send()
		.expect(200);

	// Check the response body
	expect(res2.body.title).toBe("test title");
	expect(res2.body.price).toBe(10);
});
