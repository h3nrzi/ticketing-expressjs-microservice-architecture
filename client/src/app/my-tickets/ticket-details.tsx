import { Ticket } from "@/types/Ticket";
import Link from "next/link";

const TicketDetails = async ({ tickets }: { tickets: Ticket[] }) => {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>نام تیکت</th>
					<th>قیمت تیکت</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{tickets.map((ticket) => (
					<tr key={ticket.id}>
						<td>
							<Link href={`/my-tickets/${ticket.id}`}>{ticket.title}</Link>
							{ticket.orderId && (
								<span className="badge badge-pill badge-info mr-2">
									رزرو شده
								</span>
							)}
						</td>
						<td>{ticket.price} دلار</td>
						<td>
							<Link href={`/my-tickets/${ticket.id}/edit`}>
								<button className="btn btn-sm btn-secondary">ویرایش</button>
							</Link>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default TicketDetails;
