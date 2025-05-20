import { NotAuthorizedError, NotFoundError } from "@h3nrzi-ticket/common";
import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { ITicketDocument } from "./interfaces/ticket.interface";
import { TicketRepository } from "./ticket.repository";

export interface ITicketService {
	getAllTickets(): Promise<ITicketDocument[]>;
	getTicketById(ticketId: string): Promise<ITicketDocument | null>;
	// getTicketsByUserId(userId: string): Promise<ITicketDocument[]>;
	createTicket(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument>;
	updateTicket(
		ticketId: string,
		updateTicketDto: UpdateTicketDto,
		currentUserId: string
	): Promise<ITicketDocument | null>;
	deleteTicket(
		ticketId: string,
		currentUserId: string
	): Promise<ITicketDocument | null>;
}
export class TicketService implements ITicketService {
	constructor(private readonly ticketRepository: TicketRepository) {}

	async getAllTickets() {
		// return all tickets
		return this.ticketRepository.findAll();
	}

	async getTicketById(ticketId: string) {
		// check if the ticket exists, if not, throw an error
		const ticket = await this.ticketRepository.findByTicketId(ticketId);
		if (!ticket) {
			throw new NotFoundError("Ticket not found");
		}

		// return the ticket
		return ticket;
	}

	// async getTicketsByUserId(userId: string) {
	// 	return this.ticketRepository.findByUserId(userId);
	// }

	async createTicket(createTicketDto: CreateTicketDto, userId: string) {
		// create the ticket
		const ticket = await this.ticketRepository.create(createTicketDto, userId);

		// save the ticket in the db and return the saved ticket
		return await ticket.save();
	}

	async updateTicket(
		ticketId: string,
		updateTicketDto: UpdateTicketDto,
		currentUserId: string
	) {
		// check if the ticket exists, if not, throw an error
		const ticket = await this.getTicketById(ticketId);

		// check if the current user is the owner of the ticket, if not, throw an error
		if (currentUserId !== ticket?.userId) {
			throw new NotAuthorizedError();
		}

		// update the ticket and return the updated ticket
		return await this.ticketRepository.update(ticketId, updateTicketDto);
	}

	async deleteTicket(ticketId: string, currentUserId: string) {
		// check if the ticket exists, if not, throw an error
		const ticket = await this.getTicketById(ticketId);

		// check if the current user is the owner of the ticket, if not, throw an error
		if (currentUserId !== ticket?.userId) {
			throw new NotAuthorizedError();
		}

		// delete the ticket and return the deleted ticket
		return await this.ticketRepository.delete(ticketId);
	}
}
