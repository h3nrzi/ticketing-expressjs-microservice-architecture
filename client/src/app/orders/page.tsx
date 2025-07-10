import { getCurrentUserOrders } from "@/lib/api/orders-api";

const OrdersPage = async () => {
	const { data: orders } = await getCurrentUserOrders();

	return (
		<div className="m-5">
			<h1>سفارش های من</h1>
			<ul className="mt-5">
				{orders && orders.length > 0 ? (
					orders.map((order) => (
						<li key={order.id} className="d-flex align-items-center">
							<a href={`/orders/${order.id}`}>{order.id}</a>
							{order.status === "cancelled" && (
								<span className="badge badge-danger mr-2">لغو شده</span>
							)}
							{order.status === "created" && (
								<span className="badge badge-info mr-2">درحال انتظار</span>
							)}
							{order.status === "complete" && (
								<span className="badge badge-success mr-3">تکمیل شده</span>
							)}
						</li>
					))
				) : (
					<div>سفارشی یافت نشد</div>
				)}
			</ul>
		</div>
	);
};

export default OrdersPage;
