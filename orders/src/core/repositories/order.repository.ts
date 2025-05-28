import { PopulateOptions } from "mongoose";
import { Order } from "../entities/order.entity";
import { OrderStatus } from "@h3nrzi-ticket/common";
import { IOrder, IOrderDoc } from "../interfaces/order.interface";
import { ITicketDoc } from "../interfaces/ticket.interface";

export interface IOrderRepository {
	findAll(populate?: PopulateOptions): Promise<IOrderDoc[]>;
	findById(id: string, populate?: PopulateOptions): Promise<IOrderDoc | null>;
	findByUserId(
		userId: string,
		populate?: PopulateOptions
	): Promise<IOrderDoc[]>;
	create(order: IOrder): Promise<IOrderDoc>;
	isReserved(ticket: ITicketDoc): Promise<boolean>;
}

export class OrderRepository implements IOrderRepository {
	findAll(populate?: PopulateOptions) {
		const orders = Order.find({});
		if (populate) orders.populate(populate);
		return orders;
	}

	findById(id: string, populate?: PopulateOptions) {
		const order = Order.findById(id);
		if (populate) order.populate(populate);
		return order;
	}

	findByUserId(userId: string, populate?: PopulateOptions) {
		const orders = Order.find({ userId });
		if (populate) orders.populate(populate);
		return orders;
	}

	create(order: IOrder) {
		return Order.create(order);
	}

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
