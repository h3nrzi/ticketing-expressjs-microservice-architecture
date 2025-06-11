import { OrderStatus } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { Order } from "../../core/entities/order.entity";
import { postPaymentsRequest } from "../helpers/requests";

describe("POST /api/payments", () => {
	let cookie: string[];
	let otherCookie: string[];
	let userPayload: { id: string; email: string };
	let otherUserPayload: { id: string; email: string };

	beforeAll(() => {
		userPayload = {
			id: new mongoose.Types.ObjectId().toHexString(),
			email: "test@test.com",
		};

		otherUserPayload = {
			id: new mongoose.Types.ObjectId().toHexString(),
			email: "test2@test.com",
		};

		cookie = global.signup(userPayload);
		otherCookie = global.signup(otherUserPayload);
	});

	describe("Validation DTO", () => {
		it("should return 400 if orderId is not provided", async () => {
			const response = await postPaymentsRequest(
				{ orderId: "", token: "123" },
				cookie
			);
			expect(response.status).toBe(400);
		});

		it("should return 400 if token is not provided", async () => {
			const response = await postPaymentsRequest(
				{ orderId: new mongoose.Types.ObjectId().toHexString(), token: "" },
				cookie
			);
			expect(response.status).toBe(400);
		});
	});

	describe("Authentication and Authorization", () => {
		it("should return 401 if the user is not authenticated", async () => {
			const response = await postPaymentsRequest(
				{
					orderId: new mongoose.Types.ObjectId().toHexString(),
					token: "123abc",
				},
				[]
			);

			expect(response.status).toBe(401);
		});

		it("should return 401 if the user who is trying to pay is not the same as the user who created the order", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();

			const order = Order.build({
				id: orderId,
				userId: userPayload.id,
				version: 0,
				ticketPrice: 10,
				status: OrderStatus.Created,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "123abc" },
				otherCookie
			);

			expect(response.status).toBe(401);
		});
	});

	describe("Business Logic", () => {
		it("should return 404 if the order that is being paid does not exist", async () => {
			const response = await postPaymentsRequest(
				{ orderId: new mongoose.Types.ObjectId().toHexString(), token: "123" },
				cookie
			);
			expect(response.status).toBe(404);
		});

		it("should return 400 if the order is already cancelled", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();

			const order = Order.build({
				id: orderId,
				userId: userPayload.id,
				version: 0,
				ticketPrice: 10,
				status: OrderStatus.Cancelled,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "123" },
				cookie
			);
			expect(response.status).toBe(400);
		});

		it("should return 400 if the order is already paid", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();

			const order = Order.build({
				id: orderId,
				userId: userPayload.id,
				version: 0,
				ticketPrice: 10,
				status: OrderStatus.Complete,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "123" },
				cookie
			);
			expect(response.status).toBe(400);
		});

		it("should return 201 if the payment successfully is created", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();

			const order = Order.build({
				id: orderId,
				userId: userPayload.id,
				version: 0,
				ticketPrice: 10,
				status: OrderStatus.Created,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "123" },
				cookie
			);
			expect(response.status).toBe(201);
		});
	});
});
