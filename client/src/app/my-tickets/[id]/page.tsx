import { getTicketById } from "@/lib/api/tickets-api";
import ReserveButton from "./reserve-button";
import { getCurrentUser } from "@/lib/api/users-api";
import { redirect } from "next/navigation";

interface Props {
	params: Promise<{ id: string }>;
}

const TicketDetailsPage = async ({ params }: Props) => {
	const { data: userData } = await getCurrentUser();
	const { id } = await params;
	const { data: ticket } = await getTicketById(id);

	if (!ticket) return <div>Ticket not found</div>;
	if (!userData?.currentUser) redirect("/");

	return (
		<div className="row m-5">
			<div className="col-8 p-5 rounded border">
				<h1>{ticket.title}</h1>
				<p>${ticket.price}</p>
				<ReserveButton ticketId={id} />
			</div>
		</div>
	);
};

export default TicketDetailsPage;
