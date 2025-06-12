import {
	BasePublisher,
	Subjects,
	PaymentSucceededEvent,
} from "@h3nrzi-ticket/common";

export class PaymentSucceededPublisher extends BasePublisher<PaymentSucceededEvent> {
	readonly subject = Subjects.PaymentSucceeded;
}
