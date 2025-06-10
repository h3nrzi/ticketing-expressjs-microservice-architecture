import { PaymentRepository } from "./repositories/payment.repository";
import { CreatePaymentDto } from "./dtos/payment.dto";
import { IPaymentDoc } from "./interfaces/payment.interface";
import { OrderRepository } from "./repositories/order.repository";
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
} from "@h3nrzi-ticket/common";

export class PaymentService {
	constructor(
		private readonly paymentRepository: PaymentRepository,
		private readonly orderRepository: OrderRepository
	) {}

	async createPayment(
		createPaymentDto: CreatePaymentDto,
		currentUserId: string
	): Promise<IPaymentDoc> {
		const order = await this.orderRepository.getOrder(createPaymentDto.orderId);
		if (!order) throw new NotFoundError("Order not found");

		if (order.userId !== currentUserId) throw new NotAuthorizedError();

		if (order.status === OrderStatus.Cancelled)
			throw new BadRequestError("Order is cancelled");

		if (order.status === OrderStatus.Complete)
			throw new BadRequestError("Order is already complete");

		return this.paymentRepository.createPayment(createPaymentDto, order);
	}
}
