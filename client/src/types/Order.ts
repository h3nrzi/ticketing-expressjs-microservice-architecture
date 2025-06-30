import { Ticket } from "./Ticket";

export interface Order {
	id: string;
	userId: string;
	ticket: Ticket;
	status: "created" | "cancelled" | "complete";
	expiresAt: number;
}
