import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { TicketModel } from "./entities/ticket.entity";
import { ITicketDocument } from "./interfaces/ticket.interface";

export interface ITicketRepository {
	findAll(): Promise<ITicketDocument[]>;
	findByTicketId(ticketId: string): Promise<ITicketDocument | null>;
	// findByUserId(userId: string): Promise<ITicketDocument[]>;
	create(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument>;
	update(
		ticketId: string,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument | null>;
	delete(ticketId: string): Promise<ITicketDocument | null>;
}

export class TicketRepository implements ITicketRepository {
	async findAll(): Promise<ITicketDocument[]> {
		return TicketModel.find();
	}

	async findByTicketId(ticketId: string) {
		return TicketModel.findById(ticketId);
	}

	// async findByUserId(userId: string): Promise<ITicketDocument[]> {
	// 	return TicketModel.find({ userId });
	// }

	async create(createTicketDto: CreateTicketDto, userId: string) {
		return TicketModel.build({ ...createTicketDto, userId });
	}

	async update(ticketId: string, updateTicketDto: UpdateTicketDto) {
		return TicketModel.findByIdAndUpdate(ticketId, updateTicketDto, {
			new: true,
		});
	}

	async delete(ticketId: string) {
		return TicketModel.findByIdAndDelete(ticketId);
	}
}
