import { getTicketById } from "@/lib/api/tickets-api";

interface Props {
	params: Promise<{ id: string }>;
}

const EditTicketPage = async ({ params }: Props) => {
	const { id } = await params;
	const ticket = await getTicketById(id);

	return <div>{JSON.stringify(ticket)}</div>;
};

export default EditTicketPage;
