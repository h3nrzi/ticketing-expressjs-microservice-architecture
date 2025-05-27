import { BadRequestError, NotFoundError } from "@h3nrzi-ticket/common";
import { IOrderDoc } from "./interfaces/order.interface";
import { OrderRepository } from "./repositories/order.repository";
import { TicketRepository } from "./repositories/ticket.repository";

export interface ICreateOrderService {
	createOrder(ticketId: string, userId: string): Promise<IOrderDoc>;
}

export class OrderService implements ICreateOrderService {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly ticketRepository: TicketRepository
	) {}

	async createOrder(ticketId: string, userId: string) {
		// Find the ticket the user is trying to order in the database
		// If the ticket is not found, throw an error
		const ticket = await this.ticketRepository.findById(ticketId);
		if (!ticket) throw new NotFoundError("Ticket not found");

		// Check if the ticket is already reserved
		const isReserved = await this.orderRepository.isReserved(ticket);
		if (isReserved) throw new BadRequestError("Ticket is already reserved");
	}
}
