import { getTicketById } from "@/lib/api/tickets-api";
import EditTicketForm from "./edit-ticket-form";

interface Props {
	params: Promise<{ id: string }>;
}

const EditTicketPage = async ({ params }: Props) => {
	const { id } = await params;
	const { data: ticket } = await getTicketById(id);

	if (!ticket) {
		return <div>تیکت یافت نشد</div>;
	}

	return <EditTicketForm ticket={ticket} />;
};

export default EditTicketPage;
