import request from "supertest";
import app from "../../app";

it("has a route handler listening to /api/tickets for post requests", async () => {
	// Send a POST request to the /api/tickets route
	const res = await request(app).post("/api/tickets").send({});

	// Expect the response status to not be 404
	expect(res.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
	// Send a POST request to the /api/tickets route
	const res = await request(app).post("/api/tickets").send({});

	// Expect the response status to be 401
	expect(res.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
	// Signup a user
	const cookie = await global.signup("test@test.com", "password");

	// Send a POST request to the /api/tickets route
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie!)
		.send({});

	// Expect the response status to be 401
	expect(res.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
	// await request(app)
	// 	.post("/api/tickets")
	// 	.set("Cookie", global.signin())
	// 	.send({ title: "", price: 10 })
	// 	.expect(400);
});

it("returns an error if an invalid price is provided", async () => {
	// await request(app)
	// 	.post("/api/tickets")
	// 	.set("Cookie", global.signin())
	// 	.send({ title: "test", price: -10 })
	// 	.expect(400);
});

it("creates a ticket with valid inputs", async () => {
	// let tickets = await Ticket.find({});
	// expect(tickets.length).toEqual(0);
	// await request(app)
	// 	.post("/api/tickets")
	// 	.set("Cookie", global.signin())
	// 	.send({ title: "test", price: 10 })
	// 	.expect(201);
});
