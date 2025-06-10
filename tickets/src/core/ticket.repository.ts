import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { TicketModel } from "./entities/ticket.entity";
import { ITicketDocument } from "./interfaces/ticket.interface";

export class TicketRepository {
	async findByTicketId(ticketId: string): Promise<ITicketDocument | null> {
		return TicketModel.findById(ticketId);
	}

	async create(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument> {
		return TicketModel.build({ ...createTicketDto, userId });
	}

	async update(
		ticket: ITicketDocument,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument> {
		ticket.set(updateTicketDto);
		await ticket.save();
		return ticket;
	}
}
