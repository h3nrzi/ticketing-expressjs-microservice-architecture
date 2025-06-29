import { getCurrentUserOrders } from "@/lib/api/orders-api";
import Link from "next/link";

const OrdersPage = async () => {
	const { data: orders } = await getCurrentUserOrders();

	if (!orders || orders.length === 0) return <div>No orders found</div>;

	return (
		<div>
			<h1>Orders</h1>
			<ul>
				{orders.map((order) => (
					<li key={order.id}>
						<Link href={`/orders/${order.id}`}>{order.id}</Link>
						{order.status === "cancelled" && (
							<span className="badge badge-danger ml-1">{order.status}</span>
						)}
						{order.status === "created" && (
							<span className="badge badge-info ml-1">New</span>
						)}
						{order.status === "complete" && (
							<span className="badge badge-bg-success ml-1">
								{order.status}
							</span>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default OrdersPage;
