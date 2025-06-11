import mongoose from "mongoose";
import { postPaymentsRequest } from "../helpers/requests";

describe("POST /api/payments", () => {
	let cookie: string[];
	let otherCookie: string[];
	let orderId: string;

	beforeAll(() => {
		cookie = global.signup();
		otherCookie = global.signup();
		orderId = new mongoose.Types.ObjectId().toHexString();
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
				{ orderId, token: "" },
				cookie
			);
			expect(response.status).toBe(400);
		});
	});

	// describe("Authentication and Authorization", () => {
	// 	it("should return 401 if the user is not authenticated", async () => {
	// 		const response = await postPaymentsRequest(
	// 			{ orderId, token: "123abc" },
	// 			otherCookie
	// 		);

	// 		expect(response.status).toBe(401);
	// 	});

	// 	it("should return 401 if the user who is trying to pay is not the same as the user who created the order", async () => {
	// 		const response = await postPaymentsRequest(
	// 			{ orderId, token: "123abc" },
	// 			otherCookie
	// 		);

	// 		expect(response.status).toBe(401);
	// 	});
	// });

	// describe("Business Logic", () => {
	// it("should return 404 if the order that is being paid does not exist", async () => {
	// 	const response = await postPaymentsRequest(
	// 		{ orderId, token: "123" },
	// 		cookie
	// 	);
	// 	expect(response.status).toBe(404);
	// });

	// it("should return 400 if the order is already cancelled", async () => {
	// 	const response = await postPaymentsRequest(
	// 		{ orderId, token: "123" },
	// 		cookie
	// 	);
	// 	expect(response.status).toBe(400);
	// });

	// it("should return 400 if the order is already paid", async () => {
	// 	const response = await postPaymentsRequest(
	// 		{ orderId, token: "123" },
	// 		cookie
	// 	);
	// 	expect(response.status).toBe(400);
	// });

	// it("should return 201 if the payment successfully is created", async () => {
	// 	const response = await postPaymentsRequest(
	// 		{ orderId, token: "123" },
	// 		cookie
	// 	);
	// 	expect(response.status).toBe(201);
	// });
	// });
});
