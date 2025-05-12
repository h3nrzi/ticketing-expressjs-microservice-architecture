import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it("returns a 404 of the provided id does not exist", async () => {
	await request(app)
		.patch(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
		.set("Cookie", global.signup())
		.send({ title: "asdf", price: 20 })
		.expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
	await request(app)
		.patch(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
		.send({ title: "asdf", price: 20 })
		.expect(401);
});

it("returns a 401 if the user is not own the ticket", async () => {
	// Create Ticket
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ title: "asdf", price: 20 });

	// Update Ticket
	await request(app)
		.patch(`/api/tickets/${res.body.id}`)
		.send({ title: "updated ticket", price: 20 })
		.set("Cookie", global.signup())
		.expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
	const cookie = global.signup();

	// Create Ticket
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title: "asdf", price: 20 });

	// Update Ticket with invalid title
	await request(app)
		.patch(`/api/tickets/${res.body.id}`)
		.send({ title: "", price: 20 })
		.set("Cookie", cookie)
		.expect(400);

	// Update Ticket with invalid price
	await request(app)
		.patch(`/api/tickets/${res.body.id}`)
		.send({ title: "", price: -20 })
		.set("Cookie", cookie)
		.expect(400);
});

it("updates the ticket provided valid inputs", async () => {
	const cookie = global.signup();

	// Create Ticket
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title: "asdf", price: 20 });

	// Update Ticket with valid input
	await request(app)
		.patch(`/api/tickets/${res.body.id}`)
		.send({ title: "updated title!", price: 200 })
		.set("Cookie", cookie)
		.expect(200);

	// check if the ticket was updated
	const ticketResponse = await request(app)
		.get(`/api/tickets/${res.body.id}`)
		.send({});

	expect(ticketResponse.body.title).toEqual("updated title!");
	expect(ticketResponse.body.price).toEqual(200);
});
