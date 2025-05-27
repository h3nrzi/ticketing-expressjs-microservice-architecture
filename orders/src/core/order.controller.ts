import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { ICreateOrderDto } from "./dtos/order.dto";

export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	async createOrder(req: Request, res: Response) {
		// Extract the data
		const { ticketId } = req.body as ICreateOrderDto;
		const userId = req.currentUser?.id as string;

		// Create the order
		const order = await this.orderService.createOrder(ticketId, userId);

		// Return the order to the user
		res.status(201).send(order);
	}
}
