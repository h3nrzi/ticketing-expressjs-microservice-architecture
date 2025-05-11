import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = (data = {}) => {
	return request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send(data);
};

describe("POST /api/tickets", () => {
	beforeEach(async () => {
		await Ticket.deleteMany({});
	});

	describe("Route Handler", () => {
		it("should respond with non-404 status when route exists", async () => {
			const response = await request(app).post("/api/tickets").send({});
			expect(response.status).not.toEqual(404);
		});
	});

	describe("Authentication", () => {
		it("should return 401 when user is not authenticated", async () => {
			const response = await request(app).post("/api/tickets").send({});
			expect(response.status).toEqual(401);
		});

		it("should return non-401 status when user is authenticated", async () => {
			const response = await createTicket({});
			expect(response.status).not.toEqual(401);
		});
	});

	describe("Input Validation", () => {
		describe("Title Validation", () => {
			const testCases = [
				{ title: "", price: 10, description: "empty title" },
				{ price: 10, description: "missing title" },
			];

			testCases.forEach(({ title, price, description }) => {
				it(`should return 400 when ${description}`, async () => {
					const response = await createTicket({ title, price });
					expect(response.status).toEqual(400);
				});
			});
		});

		describe("Price Validation", () => {
			const testCases = [
				{ title: "test", price: -10, description: "negative price" },
				{ title: "test", description: "missing price" },
			];

			testCases.forEach(({ title, price, description }) => {
				it(`should return 400 when ${description}`, async () => {
					const response = await createTicket({ title, price });
					expect(response.status).toEqual(400);
				});
			});
		});
	});

	describe("Ticket Creation", () => {
		const validTicket = {
			title: "Concert Ticket",
			price: 20,
		};

		it("should create a ticket with valid inputs", async () => {
			// Verify initial state
			const initialTickets = await Ticket.find({});
			expect(initialTickets).toHaveLength(0);

			// Create ticket
			const response = await createTicket(validTicket);
			expect(response.status).toEqual(201);

			// Verify ticket was created correctly
			const tickets = await Ticket.find({});
			expect(tickets).toHaveLength(1);
			expect(tickets[0]).toMatchObject(validTicket);
		});
	});
});
