import { getTicketById } from "@/lib/api/tickets-api";
import ReserveButton from "./reserve-button";

interface Props {
	params: Promise<{ id: string }>;
}

const TicketDetailsPage = async ({ params }: Props) => {
	const { id } = await params;
	const { data: ticket } = await getTicketById(id);

	if (!ticket) return <div>تیکت یافت نشد</div>;

	return (
		<div className="row m-5">
			<div className="col-8 p-5 rounded border">
				<h1>{ticket.title}</h1>
				<p>{ticket.price} دلار</p>
				<ReserveButton ticketId={id} />
			</div>
		</div>
	);
};

export default TicketDetailsPage;
