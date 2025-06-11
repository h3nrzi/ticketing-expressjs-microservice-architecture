import supertest from "supertest";
import app from "../../app";

interface CreatePaymentDto {
	orderId: string;
	token: string;
}

export const postPaymentsRequest = (
	body: CreatePaymentDto,
	token: string[]
): Promise<supertest.Response> => {
	return supertest(app).post("/api/payments").set("Cookie", token).send(body);
};
