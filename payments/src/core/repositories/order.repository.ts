import { Order } from "../entities/order.entity";
import { IOrderDoc } from "../interfaces/order.interface";

export class OrderRepository {
	async getOrder(orderId: string): Promise<IOrderDoc | null> {
		return Order.findById(orderId);
	}
}
