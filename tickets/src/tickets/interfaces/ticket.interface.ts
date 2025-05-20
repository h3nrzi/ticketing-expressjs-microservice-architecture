import { Document, Model } from "mongoose";
import { CreateTicketDto, UpdateTicketDto } from "../dtos/ticket.dto";

export interface ITicket {
	title: string;
	price: number;
	userId: string;
}

export interface ITicketDocument extends ITicket, Document {}

export interface ITicketModel extends Model<ITicketDocument> {
	build(attrs: ITicket): ITicketDocument;
}

export interface ITicketService {
	getAllTickets(): Promise<ITicketDocument[]>;
	getTicketById(id: string): Promise<ITicketDocument | null>;
	// getTicketsByUserId(userId: string): Promise<ITicketDocument[]>;
	createTicket(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument>;
	updateTicket(
		id: string,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument | null>;
	deleteTicket(id: string): Promise<ITicketDocument | null>;
}

export interface ITicketRepository {
	findAll(): Promise<ITicketDocument[]>;
	findByTicketId(id: string): Promise<ITicketDocument | null>;
	// findByUserId(userId: string): Promise<ITicketDocument[]>;
	create(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument>;
	update(
		id: string,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument | null>;
	delete(id: string): Promise<ITicketDocument | null>;
}
