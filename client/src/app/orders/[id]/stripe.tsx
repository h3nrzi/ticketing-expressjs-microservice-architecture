"use client";

import { createPayment } from "@/lib/actions/payments-actions";
import { Order } from "@/types/Order";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import StripeCheckout, { Token } from "react-stripe-checkout";

interface Props {
	order: Order;
	user?: User;
}

const Stripe = ({ order, user }: Props) => {
	const router = useRouter();

	const onToken = async (token: Token) => {
		const response = await createPayment(order.id, token.id);

		if (response.success) {
			toast.success("پرداخت با موفقیت انجام شد");
			return router.refresh();
		}

		toast.error(response.errors[0].message);
	};

	return (
		<StripeCheckout
			token={onToken}
			stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY!}
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
