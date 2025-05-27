import { PopulateOptions } from "mongoose";
import { Order } from "../entities/order.entity";
import { IOrder, IOrderDoc } from "../interfaces/order.interface";
import { OrderStatus } from "@h3nrzi-ticket/common";
import { ITicketDoc } from "../interfaces/ticket.interface";

export interface IOrderRepository {
	findAll(populate: PopulateOptions | null): Promise<IOrderDoc[]>;
	findById(
		id: string,
		populate: PopulateOptions | null
	): Promise<IOrderDoc | null>;
	findByUserId(
		userId: string,
		populate: PopulateOptions | null
	): Promise<IOrderDoc[]>;
	create(order: IOrder): Promise<IOrderDoc>;
	isReserved(ticket: ITicketDoc): Promise<boolean>;
}

export class OrderRepository implements IOrderRepository {
	// Find all orders
	findAll(populate: PopulateOptions | null = null) {
		const orders = Order.find({});
		if (populate) orders.populate(populate);
		return orders;
	}

	// Find an order by id
	findById(id: string, populate: PopulateOptions | null = null) {
		const order = Order.findById(id);
		if (populate) order.populate(populate);
		return order;
	}

	// Find orders by user id
	findByUserId(userId: string, populate: PopulateOptions | null = null) {
		const orders = Order.find({ userId });
		if (populate) orders.populate(populate);
		return orders;
	}

	// Create an order
	create(order: IOrder) {
		return Order.build(order);
	}

	// Check if a ticket is reserved
	async isReserved(ticket: ITicketDoc) {
		const order = await Order.findOne({
			ticket,
			status: {
				$in: [
					OrderStatus.Created,
					OrderStatus.AwaitingPayment,
					OrderStatus.Complete,
				],
			},
		}).populate("ticket");
		return !!order;
	}
}
