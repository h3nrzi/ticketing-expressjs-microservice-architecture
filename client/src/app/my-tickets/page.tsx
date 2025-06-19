import React from "react";
import NewButton from "./new-button";
import TicketDetails from "./ticket-details";

const MyTicketsPage = () => {
	return (
		<div className="m-5">
			<NewButton />
			<TicketDetails />
		</div>
	);
};

export default MyTicketsPage;
