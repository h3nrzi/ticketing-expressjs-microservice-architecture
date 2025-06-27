interface Props {
	params: { id: string };
}

const TicketDetailsPage = async ({ params }: Props) => {
	return <div>{params.id}</div>;
};

export default TicketDetailsPage;
