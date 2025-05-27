import request from "supertest";
import app from "../../app";

export const createOrder = async (ticketId: string, cookie: string[]) => {
	return request(app).post("/api/orders").set("Cookie", cookie).send({
		ticketId,
	});
};
