import { ChargeRepository } from "./charge.repository";
import { CreateChargeDto } from "./dtos/charge.dto";

export class ChargeService {
	constructor(private readonly chargeRepository: ChargeRepository) {}

	async createCharge(charge: CreateChargeDto) {
		return this.chargeRepository.createCharge(charge);
	}
}
