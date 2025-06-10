import { Charge } from "./entities/charge.entity";
import { CreateChargeDto } from "./dtos/charge.dto";

export class ChargeRepository {
	async createCharge(charge: CreateChargeDto) {
		return Charge.build({
			orderId: charge.orderId,
			amount: 100,
		});
	}
}
