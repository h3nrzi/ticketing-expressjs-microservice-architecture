import TicketCard from "@/app/my-tickets/ticket-card";
import { getCurrentUser } from "@/lib/api/users-api";
import { getCurrentUserTickets } from "@/lib/api/tickets-api";
import { redirect } from "next/navigation";

const TicketDetails = async () => {
	const { data } = await getCurrentUserTickets();
	const { data: userData } = await getCurrentUser();

	if (!userData?.currentUser) redirect("/");

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
