import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
} from "@h3nrzi-ticket/common";
import { IOrderDoc } from "./interfaces/order.interface";
import { OrderRepository } from "./repositories/order.repository";
import { ITicketRepository } from "./repositories/ticket.repository";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../config/nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

export class OrderService {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly ticketRepository: ITicketRepository
	) {}

	async findOrdersByUserId(userId: string): Promise<IOrderDoc[]> {
		return this.orderRepository.findByUserId(userId, { path: "ticket" });
	}

	async findOrderById(orderId: string, userId: string): Promise<IOrderDoc> {
		// Find the order, if the order is not found, throw an error
		const order = await this.orderRepository.findById(orderId, {
			path: "ticket",
		});
		if (!order) throw new NotFoundError("Order not found");

		// If the user is not the owner of the order, throw an error
		if (order.userId !== userId) throw new NotAuthorizedError();

		// Return the order
		return order;
	}

	async createOrder(ticketId: string, userId: string): Promise<IOrderDoc> {
		// Find the ticket, if the ticket is not found, throw an error
		const ticket = await this.ticketRepository.findById(ticketId);
		if (!ticket) throw new NotFoundError("Ticket not found");

		// Check if the ticket is already reserved, if the ticket is reserved, throw an error
		const isReserved = await this.orderRepository.isReserved(ticket);
		if (isReserved) throw new BadRequestError("Ticket is already reserved");

		// Calculate an expiration date for this order
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

		// Create the order and save it to the database
		const newOrder = this.orderRepository.create({
			userId,
			ticket,
			status: OrderStatus.Created,
			expiresAt: expiration,
		});
		await newOrder.save();

		// Publish the order created event
		await new OrderCreatedPublisher(natsWrapper.client).publish({
			id: newOrder.id,
			userId: newOrder.userId,
			status: newOrder.status,
			expiresAt: newOrder.expiresAt.toISOString(),
			ticket: { id: newOrder.ticket.id, price: newOrder.ticket.price },
			version: newOrder.version,
		});

		// Return the new order
		return newOrder;
	}

	async cancelOrder(orderId: string, userId: string): Promise<IOrderDoc> {
		// Find the order, if the order is not found, throw an error
		// If the user is not the owner of the order, throw an error
		const order = await this.findOrderById(orderId, userId);

		// Update the order status to cancelled
		order.status = OrderStatus.Cancelled;
		await order.save();

		// Publish the order cancelled event
		await new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			ticket: { id: order.ticket.id },
			version: order.version,
		});

		// Return the updated order
		return order;
	}
}
