import { getOrderById } from "@/lib/api/orders-api";

interface Props {
	params: Promise<{ id: string }>;
}

const OrderDetailsPage = async ({ params }: Props) => {
	const { id } = await params;
	const { data: order } = await getOrderById(id);

	if (!order) return <div>Order not found</div>;

	return <div>{order.id}</div>;
};

export default OrderDetailsPage;
