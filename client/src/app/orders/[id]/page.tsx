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
			<h1 className="h1 border p-1 rounded text-center">
				سفارش {orderData.id}
			</h1>

			{orderData.status !== "complete" && (
				<>
					<Timer timeToLeft={msLeft / 1000} />
					<div className="mt-5">
						<Stripe order={orderData} user={userData?.currentUser} />
					</div>
				</>
			)}

			{orderData.status === "complete" && (
				<p className="h1 border p-1 rounded text-center text-success">
					سفارش پرداخت شده است
				</p>
			)}
		</div>
	);
};

export default OrderDetailsPage;
