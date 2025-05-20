import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { TicketModel } from "./entities/ticket.entity";
import {
	ITicketDocument,
	ITicketRepository,
} from "./interfaces/ticket.interface";

export class TicketRepository implements ITicketRepository {
	async create(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument> {
		return TicketModel.build({ ...createTicketDto, userId });
	}

	async findAll(): Promise<ITicketDocument[]> {
		return TicketModel.find();
	}

	async findById(id: string): Promise<ITicketDocument | null> {
		return TicketModel.findById(id);
	}

	async findByUserId(userId: string): Promise<ITicketDocument[]> {
		return TicketModel.find({ userId });
	}

	async update(
		id: string,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument | null> {
		return TicketModel.findByIdAndUpdate(id, updateTicketDto, { new: true });
	}

	async delete(id: string): Promise<ITicketDocument | null> {
		return TicketModel.findByIdAndDelete(id);
	}
}
