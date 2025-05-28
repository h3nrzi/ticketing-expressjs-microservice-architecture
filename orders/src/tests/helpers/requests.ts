import request from "supertest";
import app from "../../app";

interface OrderData {
	ticketId?: string;
}

const getOrdersRequest = async (cookie: string[]) => {
	return request(app).get("/api/orders").set("Cookie", cookie);
};

const getOrderRequest = async (id: string, cookie: string[]) => {
	return request(app).get(`/api/orders/${id}`).set("Cookie", cookie);
};

const postOrderRequest = async (data: OrderData, cookie: string[]) => {
	return request(app).post("/api/orders").set("Cookie", cookie).send(data);
};

const deleteOrderRequest = async (id: string, cookie: string[]) => {
	return request(app).delete(`/api/orders/${id}`).set("Cookie", cookie);
};

export {
	getOrdersRequest,
	getOrderRequest,
	postOrderRequest,
	deleteOrderRequest,
};
