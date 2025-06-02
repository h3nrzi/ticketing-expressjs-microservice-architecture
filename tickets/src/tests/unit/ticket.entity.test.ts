import { TicketModel } from "../../core/entities/ticket.entity";

it("implements optimistic concurrency control", async () => {
	// create an instance of a ticket
	const ticket = TicketModel.build({
		title: "concert",
		price: 5,
		userId: "123",
	});

	// save the ticket to the database
	await ticket.save();

	// fetch the ticket with id "123" and version 0
	const firstInstance = await TicketModel.findById(ticket.id);
	const secondInstance = await TicketModel.findById(ticket.id);

	// make two separate changes to the tickets we fetched: id "123" and version 0
	firstInstance?.set({ price: 10 });
	secondInstance?.set({ price: 15 });

	// save the first fetched ticket
	await firstInstance?.save(); // id: "123" and version 0 => id: "123" and version 1

	// save the second fetched ticket and expect an error
	// because the version is now 1, but the second instance has a version of 0
	await expect(secondInstance?.save()).rejects.toThrow();
});

it("increments the version number on multiple saves", async () => {
	const ticket = TicketModel.build({
		title: "concert",
		price: 5,
		userId: "123",
	});

	await ticket.save();
	expect(ticket.version).toEqual(0);

	await ticket.save();
	expect(ticket.version).toEqual(1);

	await ticket.save();
	expect(ticket.version).toEqual(2);
});
