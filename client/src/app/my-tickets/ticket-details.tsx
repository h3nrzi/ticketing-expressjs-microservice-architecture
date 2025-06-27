import { Ticket } from "@/types/Ticket";

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
						<td>{ticket.title}</td>
						<td>${ticket.price}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default TicketDetails;
