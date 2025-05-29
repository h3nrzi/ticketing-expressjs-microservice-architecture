import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { ICreateOrderDto } from "./dtos/order.dto";

export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	async findOrdersByUserId(req: Request, res: Response): Promise<void> {
		const userId = req.currentUser?.id as string;
		const orders = await this.orderService.findOrdersByUserId(userId);
		res.status(200).send(orders);
	}

	async findOrderById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const userId = req.currentUser?.id as string;
		const order = await this.orderService.findOrderById(id, userId);
		res.status(200).send(order);
	}

	async createOrder(req: Request, res: Response): Promise<void> {
		const { ticketId } = req.body as ICreateOrderDto;
		const userId = req.currentUser?.id as string;
		const order = await this.orderService.createOrder(ticketId, userId);
		res.status(201).send(order);
	}

	async cancelOrder(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const userId = req.currentUser?.id as string;
		const order = await this.orderService.cancelOrder(id, userId);
		res.status(200).send(order);
	}
}
