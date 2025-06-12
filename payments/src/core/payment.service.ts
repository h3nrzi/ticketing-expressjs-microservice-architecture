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
import { stripe } from "../stripe";

export class PaymentService {
	constructor(
		private readonly paymentRepository: PaymentRepository,
		private readonly orderRepository: OrderRepository
	) {}

	async createPayment(
		createPaymentDto: CreatePaymentDto,
		currentUserId: string
	): Promise<IPaymentDoc> {
		// Check if the order exists, if not, throw an error
		const order = await this.orderRepository.getOrder(createPaymentDto.orderId);
		if (!order) throw new NotFoundError("Order not found");

		// Check if the order belongs to the current user, if not, throw an error
		if (order.userId !== currentUserId) throw new NotAuthorizedError();

		// Check if the order is already complete, if so, throw an error
		if (order.status === OrderStatus.Complete)
			throw new BadRequestError("Order is already complete");

		// Check if the order is cancelled, if so, throw an error
		if (order.status === OrderStatus.Cancelled)
			throw new BadRequestError("Order is cancelled");

		// Create a charge
		await stripe.charges.create({
			currency: "usd",
			amount: order.ticketPrice * 100, // convert to cents
			source: createPaymentDto.token,
		});

		// Create a payment
		return this.paymentRepository.createPayment(createPaymentDto, order);
	}
}
