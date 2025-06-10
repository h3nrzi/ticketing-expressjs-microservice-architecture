import { PopulateOptions } from "mongoose";
import { Order } from "../entities/order.entity";
import { OrderStatus } from "@h3nrzi-ticket/common";
import { IOrder, IOrderDoc } from "../interfaces/order.interface";
import { ITicketDoc } from "../interfaces/ticket.interface";

export class OrderRepository {
	findAll(populate?: PopulateOptions): Promise<IOrderDoc[]> {
		const orders = Order.find({});
		if (populate) orders.populate(populate);
		return orders;
	}

	findById(id: string, populate?: PopulateOptions): Promise<IOrderDoc | null> {
		const order = Order.findById(id);
		if (populate) order.populate(populate);
		return order;
	}

	findByUserId(
		userId: string,
		populate?: PopulateOptions
	): Promise<IOrderDoc[]> {
		const orders = Order.find({ userId });
		if (populate) orders.populate(populate);
		return orders;
	}

	create(order: IOrder): IOrderDoc {
		return Order.build(order);
	}

	async isReserved(ticket: ITicketDoc): Promise<boolean> {
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

	async cancelOrder(orderToCancel: IOrderDoc): Promise<IOrderDoc> {
		orderToCancel.status = OrderStatus.Cancelled;
		await orderToCancel.save();
		return orderToCancel;
	}
}
