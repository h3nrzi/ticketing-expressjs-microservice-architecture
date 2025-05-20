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

export interface ITicketRepository {
	create(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument>;
	findAll(): Promise<ITicketDocument[]>;
	findByUserId(userId: string): Promise<ITicketDocument[]>;
	update(
		id: string,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument | null>;
	delete(id: string): Promise<ITicketDocument | null>;
}

export interface ITicketService {
	createTicket(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument>;
	getTicketById(id: string): Promise<ITicketDocument | null>;
	getTicketsByUserId(userId: string): Promise<ITicketDocument[]>;
	updateTicket(
		id: string,
		updateTicketDto: UpdateTicketDto
	): Promise<ITicketDocument | null>;
	deleteTicket(id: string): Promise<ITicketDocument | null>;
}
