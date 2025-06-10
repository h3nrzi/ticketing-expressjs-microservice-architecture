import { TicketService } from "./ticket.service";
import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { Request, Response } from "express";

export class TicketController {
	constructor(private readonly ticketService: TicketService) {}

	async getTicketById(req: Request, res: Response): Promise<void> {
		const { id: ticketId } = req.params;
		const ticket = await this.ticketService.getTicketById(ticketId);
		res.status(200).send(ticket);
	}

	async createTicket(req: Request, res: Response): Promise<void> {
		const { id: currentUserId } = req.currentUser!;
		const ticket = await this.ticketService.createTicket(
			req.body as CreateTicketDto,
			currentUserId
		);
		res.status(201).send(ticket);
	}

	async updateTicket(req: Request, res: Response): Promise<void> {
		const { id: ticketId } = req.params;
		const { id: currentUserId } = req.currentUser!;
		const ticket = await this.ticketService.updateTicket(
			ticketId,
			req.body as UpdateTicketDto,
			currentUserId
		);
		res.status(200).send(ticket);
	}
}
