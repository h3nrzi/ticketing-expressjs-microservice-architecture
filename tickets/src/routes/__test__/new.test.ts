import request from "supertest";
import app from "../../app";

describe("group", () => {
	it("has a route handler listening to /api/tickets for post requests", async () => {
		const res = await request(app).post("/api/tickets").send({});
		expect(res.status).not.toEqual(404);
	});

	it("can only be accessed if the user is signed in", async () => {
		// await request(app).post("/api/tickets").send({}).expect(401);
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
});
