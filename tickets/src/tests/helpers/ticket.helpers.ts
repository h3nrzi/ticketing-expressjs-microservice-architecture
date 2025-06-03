import request from "supertest";
import app from "../../app";

export interface TicketData {
	title?: string;
	price?: number;
	orderId?: string;
}

export const createTicket = async (data: TicketData, cookie?: string[]) => {
	const req = request(app).post("/api/tickets").send(data);
	if (cookie) req.set("Cookie", cookie);
	return req;
};

export const getTicket = async (id: string) => {
	return request(app).get(`/api/tickets/${id}`);
};

export const updateTicket = async (
	id: string,
	data: Partial<TicketData>,
	cookie?: string[]
) => {
	const req = request(app).patch(`/api/tickets/${id}`).send(data);
	if (cookie) req.set("Cookie", cookie);
	return req;
};

export const deleteTicket = async (id: string, cookie?: string[]) => {
	const req = request(app).delete(`/api/tickets/${id}`);
	if (cookie) req.set("Cookie", cookie);
	return req;
};

export const getAllTickets = async () => {
	return request(app).get("/api/tickets");
};
