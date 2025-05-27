import { Ticket } from "../entities/ticket.entity";
import { ITicketDoc } from "../interfaces/ticket.interface";

export interface ITicketRepository {
	findById(id: string): Promise<ITicketDoc | null>;
}

export class TicketRepository implements ITicketRepository {
	// Find a ticket by id
	findById(id: string) {
		return Ticket.findById(id);
	}
}
