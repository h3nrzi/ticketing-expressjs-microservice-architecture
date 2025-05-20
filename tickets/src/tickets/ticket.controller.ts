import { TicketService } from "./ticket.service";
import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { Request, Response } from "express";

export class TicketController {
	constructor(private readonly ticketService: TicketService) {}

	async getAllTickets(req: Request, res: Response): Promise<void> {
		const tickets = await this.ticketService.getAllTickets();

		res.status(200).send(tickets);
	}

	async getTicketById(req: Request, res: Response): Promise<void> {
		const ticket = await this.ticketService.getTicketById(req.params.id);

		res.status(200).send(ticket);
	}

	// async getTicketsByUserId(req: Request, res: Response): Promise<void> {
	// 	const tickets = await this.ticketService.getTicketsByUserId(
	// 		req.currentUser!.id
	// 	);

	// 	res.status(200).send(tickets);
	// }

	async createTicket(req: Request, res: Response): Promise<void> {
		const ticket = await this.ticketService.createTicket(
			req.body as CreateTicketDto,
			req.currentUser!.id
		);

		res.status(201).send(ticket);
	}

	async updateTicket(req: Request, res: Response): Promise<void> {
		const ticket = await this.ticketService.updateTicket(
			req.params.id,
			req.body as UpdateTicketDto
		);

		res.status(200).send(ticket);
	}

	async deleteTicket(req: Request, res: Response): Promise<void> {
		await this.ticketService.deleteTicket(req.params.id);

		res.status(204).send();
	}
}
