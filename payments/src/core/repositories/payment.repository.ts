import { Payment } from "../entities/payment.entity";
import { CreatePaymentDto } from "../dtos/payment.dto";
import { IPaymentDoc } from "../interfaces/payment.interface";
import { IOrderDoc } from "../interfaces/order.interface";

export class PaymentRepository {
	async createPayment(
		payment: CreatePaymentDto,
		order: IOrderDoc
	): Promise<IPaymentDoc> {
		return Payment.build({
			orderId: payment.orderId,
			amount: order.ticketPrice,
		});
	}
}
