import TicketCard from "@/app/my-tickets/ticket-card";
import { getCurrentUserTickets } from "@/lib/api/tickets-api";

const TicketDetails = async () => {
	const { data } = await getCurrentUserTickets();

	if (!data || data.length === 0) return <p>You do not have any ticket...</p>;

	return (
		<>
			<h1>My Tickets</h1>
			<div className="row mt-5">
				{data.map((ticket) => (
					<div className="col-md-4 mb-2" key={ticket.id}>
						<TicketCard ticket={ticket} />
					</div>
				))}
			</div>
		</>
	);
};

export default TicketDetails;
