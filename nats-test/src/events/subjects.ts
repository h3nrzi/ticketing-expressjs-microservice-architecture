/**
 * Enum representing all possible event subjects in the system
 * Each subject represents a type of event that can be published
 */
export enum Subjects {
	/** Event emitted when a ticket is created */
	TicketCreated = "ticket:created",

	/** Event emitted when an order is updated */
	OrderUpdated = "order:updated",
}
