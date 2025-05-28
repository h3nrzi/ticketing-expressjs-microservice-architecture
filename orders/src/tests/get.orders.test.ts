import { Ticket } from "../core/entities/ticket.entity";
import { createOrder, getOrders } from "./helpers/requests";

describe("GET /api/orders", () => {
	let cookie: string[];
	let otherCookie: string[];

	beforeAll(() => {
		cookie = global.signup();
		otherCookie = global.signup();
	});

	describe("Authentication", () => {
		it("returns a 401 if the user is not authenticated", async () => {
			const res = await getOrders([]);
			expect(res.status).toBe(401);
		});
	});

	describe("Business logics", () => {
		it("returns an empty array if there are no orders", async () => {
			const res = await getOrders(cookie);
			expect(res.body).toEqual([]);
		});

		it("returns a list of orders", async () => {
			// Create tickets
			const ticket1 = await Ticket.create({ title: "concert1", price: 20 });
			const ticket2 = await Ticket.create({ title: "concert1", price: 20 });
			const ticket3 = await Ticket.create({ title: "concert2", price: 20 });

			// Create orders for users
			await createOrder({ ticketId: ticket1.id }, cookie);
			await createOrder({ ticketId: ticket2.id }, cookie);
			await createOrder({ ticketId: ticket3.id }, otherCookie);

			// Get the orders
			const responseForUser1 = await getOrders(cookie);
			const responseForUser2 = await getOrders(otherCookie);

			expect(responseForUser1.body.length).toEqual(2);
			expect(responseForUser2.body.length).toEqual(1);
		});

		it("should populate the ticket", async () => {
			const ticket = await Ticket.create({ title: "concert1", price: 20 });
			await createOrder({ ticketId: ticket.id }, cookie);

			const res = await getOrders(cookie);
			expect(res.body[0].ticket).toBeDefined();
			expect(res.body[0].ticket.id).toEqual(ticket.id);
		});
	});
});
