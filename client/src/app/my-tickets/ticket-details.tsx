import { Ticket } from "@/types/Ticket";
import Link from "next/link";

const TicketDetails = async ({ tickets }: { tickets: Ticket[] }) => {
	return (
		<table className="table">
			<thead>
				<tr>
					<th>Ticket Name</th>
					<th>Ticket Price</th>
				</tr>
			</thead>
			<tbody>
				{tickets.map((ticket) => (
					<tr key={ticket.id}>
						<td>
							<Link href={`/my-tickets/${ticket.id}`}>{ticket.title}</Link>
						</td>
						<td>${ticket.price}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default TicketDetails;
