import { getOrderById } from "@/lib/api/orders-api";
import Timer from "./timer";

interface Props {
	params: Promise<{ id: string }>;
}

const OrderDetailsPage = async ({ params }: Props) => {
	const { id } = await params;
	const { data: order } = await getOrderById(id);

	if (!order) return <div>Order not found</div>;

	const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();

	return (
		<div className="m-5">
			<Timer timeToLeft={msLeft / 1000} />
		</div>
	);
};

export default OrderDetailsPage;
