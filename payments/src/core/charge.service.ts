import { ChargeRepository } from "./repositories/charge.repository";
import { CreateChargeDto } from "./dtos/charge.dto";
import { IChargeDoc } from "./interfaces/charge.interface";
import { OrderRepository } from "./repositories/order.repository";
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
} from "@h3nrzi-ticket/common";

export class ChargeService {
	constructor(
		private readonly chargeRepository: ChargeRepository,
		private readonly orderRepository: OrderRepository
	) {}

	async createCharge(
		createChargeDto: CreateChargeDto,
		currentUserId: string
	): Promise<IChargeDoc> {
		const order = await this.orderRepository.getOrder(createChargeDto.orderId);
		if (!order) throw new NotFoundError("Order not found");

		if (order.userId !== currentUserId) throw new NotAuthorizedError();

		if (order.status === OrderStatus.Cancelled)
			throw new BadRequestError("Order is cancelled");

		if (order.status === OrderStatus.Complete)
			throw new BadRequestError("Order is already complete");

		return this.chargeRepository.createCharge(createChargeDto, order);
	}
}
