import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
} from "@h3nrzi-ticket/common";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { TicketRepository } from "./ticket.repository";
import { natsWrapper } from "../config/nats-wrapper";
import { ITicketDocument } from "./interfaces/ticket.interface";

export class TicketService {
	constructor(private readonly ticketRepository: TicketRepository) {}

	async getTicketById(ticketId: string): Promise<ITicketDocument> {
		// check if the ticket exists, if not, throw an error
		const ticket = await this.ticketRepository.findByTicketId(ticketId);
		if (!ticket) throw new NotFoundError("Ticket not found");

		// return the ticket
		return ticket;
	}

	async createTicket(
		createTicketDto: CreateTicketDto,
		userId: string
	): Promise<ITicketDocument> {
		// create the ticket
		const ticket = await this.ticketRepository.create(createTicketDto, userId);

		// save the ticket in the db and return the saved ticket
		const savedTicket = await ticket.save();

		// publish the ticket created event
		await new TicketCreatedPublisher(natsWrapper.client).publish({
			id: savedTicket.id,
			title: savedTicket.title,
			price: savedTicket.price,
			userId: savedTicket.userId,
			version: savedTicket.version,
		});

		return savedTicket;
	}

	async updateTicket(
		ticketId: string,
		updateTicketDto: UpdateTicketDto,
		currentUserId: string
	): Promise<ITicketDocument> {
		// check if the ticket exists, if not, throw an error
		const ticket = await this.getTicketById(ticketId);

		// check if the ticket is reserved, if it is, throw an error
		if (ticket.orderId)
			throw new BadRequestError("Cannot edit a reserved ticket");

		// check if the current user is the owner of the ticket, if not, throw an error
		if (currentUserId !== ticket?.userId) throw new NotAuthorizedError();

		// update the ticket
		const updatedTicket = await this.ticketRepository.update(
			ticket,
			updateTicketDto
		);

		// publish the ticket updated event
		await new TicketUpdatedPublisher(natsWrapper.client).publish({
			id: updatedTicket.id,
			title: updatedTicket.title,
			price: updatedTicket.price,
			userId: updatedTicket.userId,
			version: updatedTicket.version,
		});

		// return the updated ticket
		return updatedTicket;
	}
}
