import { getOrderById } from "@/lib/api/orders-api";
import { getCurrentUser } from "@/lib/api/users-api";
import Stripe from "./stripe";
import Timer from "./timer";

interface Props {
	params: Promise<{ id: string }>;
}

const OrderDetailsPage = async ({ params }: Props) => {
	const { id } = await params;
	const { data: orderData } = await getOrderById(id);
	const { data: userData } = await getCurrentUser();

	if (!orderData) return <div>سفارش یافت نشد</div>;

	const msLeft = new Date(orderData.expiresAt).getTime() - new Date().getTime();

	return (
		<div className="m-5">
			<Timer timeToLeft={msLeft / 1000} />
			<Stripe order={orderData} user={userData?.currentUser} />
		</div>
	);
};

export default OrderDetailsPage;
