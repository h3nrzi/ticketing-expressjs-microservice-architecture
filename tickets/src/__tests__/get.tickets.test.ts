import { createTicket, getAllTickets } from "./helpers/ticket.helpers";

describe("GET /api/tickets", () => {
	let cookie: string[];

	beforeAll(() => {
		cookie = global.signup();
	});

	it("returns all tickets", async () => {
		await createTicket({ title: "Concert", price: 20 }, cookie);
		await createTicket({ title: "Movie", price: 15 }, cookie);

		const res = await getAllTickets();

		expect(res.status).toBe(200);
		expect(res.body.length).toBe(2);
		expect(res.body[0].title).toBe("Concert");
		expect(res.body[1].title).toBe("Movie");
	});

	it("returns empty array when no tickets exist", async () => {
		const res = await getAllTickets();

		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
	});
});
