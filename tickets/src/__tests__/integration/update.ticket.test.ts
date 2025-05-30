import mongoose from "mongoose";
import { createTicket, updateTicket } from "../helpers/ticket.helpers";
import { natsWrapper } from "../../config/nats-wrapper";

describe("PATCH /api/tickets/:id", () => {
	let cookie: string[];
	let otherCookie: string[];

	beforeEach(() => {
		cookie = global.signup();
		otherCookie = global.signup();
	});

	describe("successful scenarios", () => {
		it("should update a ticket with valid data and authentication", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;

			const res = await updateTicket(
				id,
				{ title: "Updated Concert", price: 30 },
				cookie
			);

			expect(res.status).toBe(200);
			expect(res.body.title).toBe("Updated Concert");
			expect(res.body.price).toBe(30);
		});

		it("publishes an event", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;

			const res = await updateTicket(
				id,
				{ title: "Updated Concert", price: 30 },
				cookie
			);

			expect(natsWrapper.client.publish).toHaveBeenCalledTimes(4);
		});
	});

	describe("authentication scenarios", () => {
		it("should fail if not authenticated", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;

			const res = await updateTicket(id, {
				title: "Updated Concert",
				price: 30,
			});
			expect(res.status).toBe(401);
		});

		it("should fail if user is not the owner of the ticket", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;

			const res = await updateTicket(
				id,
				{ title: "Hacked Title", price: 100 },
				otherCookie
			);
			expect(res.status).toBe(401);
		});
	});

	describe("validation scenarios", () => {
		it("should fail with 400 if title is empty", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;

			const res = await updateTicket(id, { title: "", price: 30 }, cookie);
			expect(res.status).toBe(400);
		});

		it("should fail with 400 if price is negative", async () => {
			const createRes = await createTicket(
				{ title: "Concert", price: 20 },
				cookie
			);
			const id = createRes.body.id;

			const res = await updateTicket(
				id,
				{ title: "Concert", price: -10 },
				cookie
			);
			expect(res.status).toBe(400);
		});
	});

	describe("not found scenarios", () => {
		it("should return 404 if ticket not found", async () => {
			const id = new mongoose.Types.ObjectId().toHexString();
			const res = await updateTicket(
				id,
				{ title: "Updated Concert", price: 30 },
				cookie
			);
			expect(res.status).toBe(404);
		});
	});
});
