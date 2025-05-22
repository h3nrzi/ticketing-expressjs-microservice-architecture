import { createTicket } from "./helpers/ticket.helpers";
import { natsWrapper } from "../__mocks__/nats";

// Mock the nats wrapper
jest.mock("../config/nats");

describe("POST /api/tickets", () => {
	let cookie: string[];
	const validTicket = { title: "Sample Ticket", price: 20 };

	beforeAll(() => {
		cookie = global.signup();
	});

	describe("successful ticket creation", () => {
		it("creates a ticket with valid data", async () => {
			const res = await createTicket(validTicket, cookie);

			expect(res.status).toBe(201);
			expect(res.body).toEqual(
				expect.objectContaining({
					title: validTicket.title,
					price: validTicket.price,
					id: expect.any(String),
					userId: expect.any(String),
				})
			);
		});
	});

	describe("authentication", () => {
		it("fails if not authenticated", async () => {
			const res = await createTicket(validTicket);
			expect(res.status).toBe(401);
		});
	});

	describe("validation", () => {
		describe("title validation", () => {
			it.each([
				["missing", { price: 10 }],
				["empty", { title: "", price: 10 }],
				["undefined", { title: undefined, price: 10 }],
			])("fails if title is %s", async (_, invalidData) => {
				const res = await createTicket(invalidData, cookie);
				expect(res.status).toBe(400);
			});
		});

		describe("price validation", () => {
			it.each([
				["missing", { title: "No Price" }],
				["negative", { title: "Negative Price", price: -5 }],
				["zero", { title: "Zero Price", price: 0 }],
				["undefined", { title: "Undefined Price", price: undefined }],
			])("fails if price is %s", async (_, invalidData) => {
				const res = await createTicket(invalidData, cookie);
				expect(res.status).toBe(400);
			});
		});
	});
});
