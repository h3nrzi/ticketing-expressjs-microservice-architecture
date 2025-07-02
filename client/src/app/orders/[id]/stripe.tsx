"use client";

import { Order } from "@/types/Order";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import StripeCheckout, { Token } from "react-stripe-checkout";

interface Props {
	order: Order;
	user?: User;
}

const Stripe = ({ order, user }: Props) => {
	const router = useRouter();

	const onToken = async (token: Token) => {
		const response = await fetch("http://ticketing.dev/api/payments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({
				token: token.id,
				orderId: order.id,
			}),
		});

		if (response.ok) {
			router.push("/orders");
		}
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
			description={`Order ${order.id} for ${order.ticket.title}`}
			locale="fa"
		/>
	);
};

export default Stripe;
