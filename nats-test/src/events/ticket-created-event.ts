import { Subjects } from "./subjects";

/** Interface representing the data structure for a ticket created event */
export interface TicketCreatedEvent {
	/** The subject of the event */
	subject: Subjects.TicketCreated;

	/** The data payload of the event */
	data: {
		/** Unique identifier for the ticket */
		id: string;

		/** Title of the ticket */
		title: string;

		/** Price of the ticket in the smallest currency unit (e.g., cents) */
		price: number;
	};
}
