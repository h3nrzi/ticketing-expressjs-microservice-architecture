"use client";

import { createPayment } from "@/lib/actions/payments-actions";
import { Order } from "@/types/Order";
import { User } from "@/types/User";
import { toast } from "react-hot-toast";
import StripeCheckout, { Token } from "react-stripe-checkout";

interface Props {
	order: Order;
	user?: User;
}

const Stripe = ({ order, user }: Props) => {
	const onToken = async (token: Token) => {
		const response = await createPayment(order.id, token.id);

		if (response.success) {
			return toast.success("پرداخت با موفقیت انجام شد");
		}

		toast.error(response.errors[0].message);
	};

	return (
		<StripeCheckout
			token={onToken}
			stripeKey={
				"pk_test_51OaCacLQVey4LCJDba9SAJgqhZ64ESaDLqFYXghugmYllyKQUrpkVWCNLi1x5f8uyo3ZGvJ0fs6HPfiFYpUyNthx00tnQtfL7m"
			}
			amount={order.ticket.price * 100}
			currency="usd"
			email={user?.email}
			name="Order Payment"
			description={`Order: ${order.id}`}
			locale="fa"
		/>
	);
};

export default Stripe;
