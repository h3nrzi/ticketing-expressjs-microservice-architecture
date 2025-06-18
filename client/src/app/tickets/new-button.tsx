import Link from "next/link";

const NewButton = () => {
	return (
		<div className="d-flex justify-content-end">
			<Link href="/tickets/new">
				<button className="btn btn-primary">New Tickets</button>
			</Link>
		</div>
	);
};

export default NewButton;
