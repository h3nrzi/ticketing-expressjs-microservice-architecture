import request from "supertest";
import app from "../../app";

interface OrderData {
	ticketId?: string;
}

export const createOrder = async (data: OrderData, cookie: string[]) => {
	return request(app).post("/api/orders").set("Cookie", cookie).send(data);
};
