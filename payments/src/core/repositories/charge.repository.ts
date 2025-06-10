import { Charge } from "../entities/charge.entity";
import { CreateChargeDto } from "../dtos/charge.dto";
import { IChargeDoc } from "../interfaces/charge.interface";
import { IOrderDoc } from "../interfaces/order.interface";

export class ChargeRepository {
	async createCharge(
		charge: CreateChargeDto,
		order: IOrderDoc
	): Promise<IChargeDoc> {
		return Charge.build({
			orderId: charge.orderId,
			amount: order.ticketPrice,
		});
	}
}
