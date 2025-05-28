import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { ICreateOrderDto } from "./dtos/order.dto";

export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	async findOrdersByUserId(req: Request, res: Response) {
		const userId = req.currentUser?.id as string;
		const orders = await this.orderService.findOrdersByUserId(userId);

		res.status(200).send(orders);
	}

	async createOrder(req: Request, res: Response) {
		const { ticketId } = req.body as ICreateOrderDto;
		const userId = req.currentUser?.id as string;

		const order = await this.orderService.createOrder(ticketId, userId);

		res.status(201).send(order);
	}
}
