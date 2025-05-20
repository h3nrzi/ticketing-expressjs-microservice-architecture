import request from "supertest";
import app from "../../app";
import { TicketModel } from "../../tickets/entities/ticket.entity";
import mongoose from "mongoose";

export const createTicket = async (overrides = {}, cookie?: string[]) => {
	const ticket = {
		title: "Sample Ticket",
		price: 100,
		...overrides,
	};
	const req = request(app).post("/api/tickets").send(ticket);
	if (cookie) req.set("Cookie", cookie);
	return req;
};

describe("Ticket Routes", () => {
	let cookie: string[];

	beforeAll(() => {
		cookie = global.signup();
	});

	beforeEach(async () => {
		await TicketModel.deleteMany({});
	});

	describe("GET /api/tickets", () => {
		it("returns all tickets", async () => {
			await createTicket({ title: "Concert", price: 20 }, cookie);
			await createTicket({ title: "Movie", price: 15 }, cookie);
			const res = await request(app).get("/api/tickets").expect(200);
			expect(res.body.length).toBe(2);
			expect(res.body[0].title).toBe("Concert");
			expect(res.body[1].title).toBe("Movie");
		});
	});

	describe("POST /api/tickets", () => {
		it("creates a ticket with valid input", async () => {
			const res = await createTicket({ title: "Concert", price: 50 }, cookie);
			expect(res.status).toBe(201);
			expect(res.body.title).toBe("Concert");
			expect(res.body.price).toBe(50);
			expect(res.body.userId).toBeDefined();
		});

		it("fails if not authenticated", async () => {
			const res = await createTicket({ title: "Concert", price: 20 });
			expect(res.status).toBe(401);
		});

		it("fails with invalid title", async () => {
			const res = await createTicket({ title: "", price: 20 }, cookie);
			expect(res.status).toBe(400);
		});

		it("fails with invalid price", async () => {
			const res = await createTicket({ title: "Concert", price: -10 }, cookie);
			expect(res.status).toBe(400);
		});
	});

	describe("GET /api/tickets/:id", () => {
		it("returns a ticket by id", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;
			const res = await request(app).get(`/api/tickets/${id}`).expect(200);
			expect(res.body.title).toBe("Concert");
			expect(res.body.price).toBe(20);
		});

		it("returns 404 if ticket not found", async () => {
			const id = new mongoose.Types.ObjectId().toHexString();
			await request(app).get(`/api/tickets/${id}`).expect(404);
		});
	});

	describe("PATCH /api/tickets/:id", () => {
		it("updates a ticket", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;
			const res = await request(app)
				.patch(`/api/tickets/${id}`)
				.set("Cookie", cookie)
				.send({ title: "Updated Concert", price: 30 });
			expect(res.status).toBe(200);
			expect(res.body.title).toBe("Updated Concert");
			expect(res.body.price).toBe(30);
		});

		it("fails if not authenticated", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;
			const res = await request(app)
				.patch(`/api/tickets/${id}`)
				.send({ title: "Updated Concert", price: 30 });
			expect(res.status).toBe(401);
		});

		it("returns 404 if ticket not found", async () => {
			const id = new mongoose.Types.ObjectId().toHexString();
			const res = await request(app)
				.patch(`/api/tickets/${id}`)
				.set("Cookie", cookie)
				.send({ title: "Updated Concert", price: 30 });
			expect(res.status).toBe(404);
		});
	});

	describe("DELETE /api/tickets/:id", () => {
		it("deletes a ticket", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;
			const delRes = await request(app)
				.delete(`/api/tickets/${id}`)
				.set("Cookie", cookie)
				.send();
			expect(delRes.status).toBe(204);
			await request(app).get(`/api/tickets/${id}`).expect(404);
		});

		it("fails if not authenticated", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;
			const res = await request(app).delete(`/api/tickets/${id}`).send();
			expect(res.status).toBe(401);
		});

		it("returns 404 if ticket not found", async () => {
			const id = new mongoose.Types.ObjectId().toHexString();
			const res = await request(app)
				.delete(`/api/tickets/${id}`)
				.set("Cookie", cookie)
				.send();
			expect(res.status).toBe(404);
		});
	});
});
