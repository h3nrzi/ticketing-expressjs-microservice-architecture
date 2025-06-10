import { Request, Response } from "express";
import { ChargeService } from "./charge.service";

export class ChargeController {
	constructor(private readonly chargeService: ChargeService) {}

	async createCharge(req: Request, res: Response) {
		const charge = await this.chargeService.createCharge(req.body);
		res.status(201).json(charge);
	}
}
