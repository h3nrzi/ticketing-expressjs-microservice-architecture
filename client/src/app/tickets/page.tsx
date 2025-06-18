import React from "react";
import NewButton from "./new-button";

const TicketsPage = () => {
	return (
		<div className="m-5">
			<NewButton />

			<h1>Tickets</h1>
			<div className="row">
				<div className="col-md-4">
					<div className="card">
						<div className="card-body">
							<h5 className="card-title">Ticket 1</h5>
							<p className="card-text">Description of ticket 1</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TicketsPage;
