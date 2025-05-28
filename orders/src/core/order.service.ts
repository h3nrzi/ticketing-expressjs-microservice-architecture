import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
} from "@h3nrzi-ticket/common";
import { IOrderDoc } from "./interfaces/order.interface";
import { IOrderRepository } from "./repositories/order.repository";
import { ITicketRepository } from "./repositories/ticket.repository";

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

export interface ICreateOrderService {
	createOrder(ticketId: string, userId: string): Promise<IOrderDoc>;
	findOrdersByUserId(userId: string): Promise<IOrderDoc[]>;
}

export class OrderService implements ICreateOrderService {
	constructor(
		private readonly orderRepository: IOrderRepository,
		private readonly ticketRepository: ITicketRepository
	) {}

	async findOrdersByUserId(userId: string) {
		return this.orderRepository.findByUserId(userId, { path: "ticket" });
	}

	async createOrder(ticketId: string, userId: string) {
		// Find the ticket the user is trying to order in the database
		// If the ticket is not found, throw an error
		const ticket = await this.ticketRepository.findById(ticketId);
		if (!ticket) throw new NotFoundError("Ticket not found");

		// Check if the ticket is already reserved
		// If the ticket is reserved, throw an error
		const isReserved = await this.orderRepository.isReserved(ticket);
		if (isReserved) throw new BadRequestError("Ticket is already reserved");

		// Calculate an expiration date for this order
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

		// Create the order and save it to the database
		const newOrder = await this.orderRepository.create({
			userId,
			ticket,
			status: OrderStatus.Created,
			expiresAt: expiration,
		});

		// Return the new order
		return newOrder;
	}
}
