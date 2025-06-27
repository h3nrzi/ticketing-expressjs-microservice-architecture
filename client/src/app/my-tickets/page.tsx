import React from "react";
import NewButton from "./new-button";
import TicketDetails from "./ticket-details";
import { getCurrentUser } from "@/lib/api/users-api";
import { redirect } from "next/navigation";
import { getCurrentUserTickets } from "@/lib/api/tickets-api";

const MyTicketsPage = async () => {
	const { data: userData } = await getCurrentUser();
	const { data: tickets } = await getCurrentUserTickets();

	if (!userData?.currentUser) redirect("/");

	return (
		<div className="m-5">
			<div className="row justify-content-between">
				<h1 className="mb-5">My Tickets</h1>
				<NewButton />
			</div>
			{!tickets || tickets.length === 0 ? (
				<p>You do not have any ticket...</p>
			) : (
				<TicketDetails tickets={tickets} />
			)}
		</div>
	);
};

export default MyTicketsPage;
