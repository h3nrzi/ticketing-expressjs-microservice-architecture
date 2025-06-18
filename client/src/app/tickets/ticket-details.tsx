import TicketCard from "@/app/tickets/ticket-card";

const TicketDetails = () => {
	return (
		<>
			<h1>Tickets</h1>
			<div className="row mt-5">
				<div className="col-md-4">
					<TicketCard ticket={{ title: "Ticket 1", price: 100 }} />
				</div>
			</div>
		</>
	);
};

export default TicketDetails;
