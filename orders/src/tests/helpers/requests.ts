import request from "supertest";
import app from "../../app";

interface OrderData {
	ticketId?: string;
}

export const getOrders = async (cookie: string[]) => {
	return request(app).get("/api/orders").set("Cookie", cookie);
};

export const createOrder = async (data: OrderData, cookie: string[]) => {
	return request(app).post("/api/orders").set("Cookie", cookie).send(data);
};
