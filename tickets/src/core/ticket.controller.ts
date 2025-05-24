import { TicketService } from "./ticket.service";
import { CreateTicketDto, UpdateTicketDto } from "./ticket.dto";
import { Request, Response } from "express";

export class TicketController {
	constructor(private readonly ticketService: TicketService) {}

	async getAllTickets(req: Request, res: Response): Promise<void> {
		const tickets = await this.ticketService.getAllTickets();
		res.status(200).send(tickets);
	}

	async getTicketById(req: Request, res: Response): Promise<void> {
		// extract data from request
		const { id: ticketId } = req.params;

		// get the ticket
		const ticket = await this.ticketService.getTicketById(ticketId);

		res.status(200).send(ticket);
	}

	// async getTicketsByUserId(req: Request, res: Response): Promise<void> {
	// 	const tickets = await this.ticketService.getTicketsByUserId(
	// 		req.currentUser!.id
	// 	);

	// 	res.status(200).send(tickets);
	// }

	async createTicket(req: Request, res: Response): Promise<void> {
		// extract data from request
		const { id: currentUserId } = req.currentUser!;

		// create the ticket
		const ticket = await this.ticketService.createTicket(
			req.body as CreateTicketDto,
			currentUserId
		);

		res.status(201).send(ticket);
	}

	async updateTicket(req: Request, res: Response): Promise<void> {
		// extract data from request
		const { id: ticketId } = req.params;
		const { id: currentUserId } = req.currentUser!;

		// update the ticket
		const ticket = await this.ticketService.updateTicket(
			ticketId,
			req.body as UpdateTicketDto,
			currentUserId
		);

		res.status(200).send(ticket);
	}

	async deleteTicket(req: Request, res: Response): Promise<void> {
		// extract data from request
		const { id: ticketId } = req.params;
		const { id: currentUserId } = req.currentUser!;

		// delete the ticket
		await this.ticketService.deleteTicket(ticketId, currentUserId);

		res.status(204).send();
	}
}
