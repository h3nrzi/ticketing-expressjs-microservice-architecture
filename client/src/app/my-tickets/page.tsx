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
				<h1 className="mb-5">تیکت های من</h1>
				<NewButton />
			</div>
			{!tickets || tickets.length === 0 ? (
				<p>شما هیچ تیکتی ندارید...</p>
			) : (
				<TicketDetails tickets={tickets} />
			)}
		</div>
	);
};

export default MyTicketsPage;
