import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { ITicketDocument, ITicketService } from "./interfaces/ticket.interface";
import { TicketRepository } from "./ticket.repository";
import { NotFoundError } from "@h3nrzi-ticket/common";
export class TicketService implements ITicketService {
	constructor(private readonly ticketRepository: TicketRepository) {}

	async createTicket(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument> {
		const ticket = await this.ticketRepository.create(createTicketDto, userId);
		await ticket.save();
		return ticket;
	}

	async getTicketById(id: string): Promise<ITicketDocument | null> {
		const ticket = await this.ticketRepository.findById(id);
		if (!ticket) {
			throw new NotFoundError("Ticket not found");
		}

		return ticket;
	}

	async getTicketsByUserId(userId: string): Promise<ITicketDocument[]> {
		return this.ticketRepository.findByUserId(userId);
	}

	async updateTicket(
		id: string,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument | null> {
		const ticket = await this.ticketRepository.update(id, updateTicketDto);
		if (!ticket) {
			throw new NotFoundError("Ticket not found");
		}

		return ticket;
	}

	async deleteTicket(id: string): Promise<ITicketDocument | null> {
		const ticket = await this.ticketRepository.delete(id);
		if (!ticket) {
			throw new NotFoundError("Ticket not found");
		}

		return ticket;
	}
}
