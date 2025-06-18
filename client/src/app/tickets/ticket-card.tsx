interface Ticket {
	title: string;
	price: number;
}

interface Props {
	ticket: Ticket;
}

const TicketCard = ({ ticket }: Props) => {
	return (
		<div className="card">
			<div className="card-body">
				<h5 className="card-title">{ticket.title}</h5>
				<p className="card-text">${ticket.price}</p>
			</div>
		</div>
	);
};

export default TicketCard;
