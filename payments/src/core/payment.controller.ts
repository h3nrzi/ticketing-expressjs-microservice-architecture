import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	async createPayment(req: Request, res: Response): Promise<void> {
		const payment = await this.paymentService.createPayment(
			req.body,
			req.currentUser!.id
		);
		res.status(201).json(payment);
	}
}
