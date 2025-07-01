"use client";

import { Order } from "@/types/Order";
import { User } from "@/types/User";
import StripeCheckout from "react-stripe-checkout";

interface Props {
	order: Order;
	user?: User;
}

const Stripe = ({ order, user }: Props) => {
	return (
		<StripeCheckout
			token={(token) => console.log(token)}
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
