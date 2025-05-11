import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
	// Send a POST request
	const res = await request(app).post("/api/tickets").send({});

	// Expect the response status to not be 404
	expect(res.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	// Send a POST request
	const res = await request(app).post("/api/tickets").send({});

	// Expect the response status to be 401
	expect(res.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
	// Send a POST request
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({});

	// Expect the response status to be 401
	expect(res.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
	// Signup a user
	const cookie = global.signup();

	// Send a POST request with an invalid title
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ title: "", price: 10 });

	// Send a POST request without a title
	const res2 = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ price: 10 });

	// Expect the responses to have the correct status codes
	expect(res.status).toEqual(400);
	expect(res2.status).toEqual(400);
});

it("returns an error if an invalid price is provided", async () => {
	// Signup a user
	const cookie = global.signup();

	// Send a POST request with an invalid price
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ title: "test", price: -10 });

	// Send a POST request without a price
	const res2 = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ title: "test" });

	// Expect the responses to have the correct status codes
	expect(res.status).toEqual(400);
	expect(res2.status).toEqual(400);
});

it("creates a ticket with valid inputs", async () => {
	// Create a ticket before the request
	let tickets = await Ticket.find({});

	// Expect there was no ticket created
	expect(tickets.length).toEqual(0);

	// Send a POST request to create a ticket
	// And expect the response status to be 201
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({ title: "test", price: 10 })
		.expect(201);

	// Add in a check to make sure a ticket was created
	tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].title).toEqual("test");
	expect(tickets[0].price).toEqual(10);
});
