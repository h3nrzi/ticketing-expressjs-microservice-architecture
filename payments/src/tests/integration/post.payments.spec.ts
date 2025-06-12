import { OrderStatus } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { Order } from "../../core/entities/order.entity";
import { postPaymentsRequest } from "../helpers/requests";
import { stripe } from "../../stripe";
import { Payment } from "../../core/entities/payment.entity";

describe("POST /api/payments", () => {
	let alexCookie: string[];
	let bobCookie: string[];
	let alexUserPayload: { id: string; email: string };
	let bobUserPayload: { id: string; email: string };

	beforeAll(() => {
		alexUserPayload = {
			id: new mongoose.Types.ObjectId().toHexString(),
			email: "alex@test.com",
		};

		bobUserPayload = {
			id: new mongoose.Types.ObjectId().toHexString(),
			email: "bob@test.com",
		};

		alexCookie = global.signup(alexUserPayload);
		bobCookie = global.signup(bobUserPayload);
	});

	describe("Validation DTO", () => {
		it("should return 400 if orderId is not provided", async () => {
			const response = await postPaymentsRequest(
				{ orderId: "", token: "tok_visa" },
				alexCookie
			);
			expect(response.status).toBe(400);
		});

		it("should return 400 if token is not provided", async () => {
			const response = await postPaymentsRequest(
				{ orderId: new mongoose.Types.ObjectId().toHexString(), token: "" },
				alexCookie
			);
			expect(response.status).toBe(400);
		});
	});

	describe("Authentication and Authorization", () => {
		it("should return 401 if the user is not authenticated", async () => {
			const response = await postPaymentsRequest(
				{
					orderId: new mongoose.Types.ObjectId().toHexString(),
					token: "tok_visa",
				},
				[]
			);

			expect(response.status).toBe(401);
		});

		it("should return 401 if the user who is trying to pay is not the same as the user who created the order", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();

			const order = Order.build({
				id: orderId,
				userId: alexUserPayload.id,
				version: 0,
				ticketPrice: 10,
				status: OrderStatus.Created,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "tok_visa" },
				bobCookie
			);

			expect(response.status).toBe(401);
		});
	});

	describe("Business Logic", () => {
		it("should return 404 if the order that is being paid does not exist", async () => {
			const response = await postPaymentsRequest(
				{
					orderId: new mongoose.Types.ObjectId().toHexString(),
					token: "tok_visa",
				},
				alexCookie
			);
			expect(response.status).toBe(404);
		});

		it("should return 400 if the order is already cancelled", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();

			const order = Order.build({
				id: orderId,
				userId: alexUserPayload.id,
				version: 0,
				ticketPrice: 10,
				status: OrderStatus.Cancelled,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "tok_visa" },
				alexCookie
			);
			expect(response.status).toBe(400);
		});

		it("should return 400 if the order is already paid", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();

			const order = Order.build({
				id: orderId,
				userId: alexUserPayload.id,
				version: 0,
				ticketPrice: 10,
				status: OrderStatus.Complete,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "tok_visa" },
				alexCookie
			);
			expect(response.status).toBe(400);
		});

		it("should return 201 if the payment successfully is created", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();
			const ticketPrice = Math.floor(Math.random() * 500);

			const order = Order.build({
				id: orderId,
				userId: alexUserPayload.id,
				version: 0,
				ticketPrice,
				status: OrderStatus.Created,
			});
			await order.save();

			const response = await postPaymentsRequest(
				{ orderId, token: "tok_visa" },
				alexCookie
			);

			// Assertions
			expect(response.status).toBe(201);
			const stripeCharges = await stripe.charges.list({ limit: 50 });
			const stripeCharge = stripeCharges.data.find(
				(charge): boolean => charge.amount === ticketPrice * 100
			);
			expect(stripeCharge).not.toBeFalsy();
		});

		it("should save the payment to the database", async () => {
			const orderId = new mongoose.Types.ObjectId().toHexString();
			const ticketPrice = Math.floor(Math.random() * 500);

			const order = Order.build({
				id: orderId,
				userId: alexUserPayload.id,
				version: 0,
				ticketPrice,
				status: OrderStatus.Created,
			});
			await order.save();

			await postPaymentsRequest({ orderId, token: "tok_visa" }, alexCookie);

			const payment = await Payment.findOne({ orderId });
			expect(payment).not.toBeNull();
			expect(payment?.amount).toEqual(ticketPrice);
			expect(payment?.stripeId).not.toBeNull();
		});
	});
});
