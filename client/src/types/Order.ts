export interface Order {
	id: string;
	userId: string;
	ticketId: string;
	status: "created" | "cancelled" | "complete";
	expiresAt: string;
}
