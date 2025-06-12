import { Payment } from "../entities/payment.entity";
import { IPaymentDoc } from "../interfaces/payment.interface";

export class PaymentRepository {
	async createPayment(
		orderId: string,
		stripeId: string,
		amount: number
	): Promise<IPaymentDoc> {
		return Payment.build({ orderId, amount, stripeId });
	}
}
