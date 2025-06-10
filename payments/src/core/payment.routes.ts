import express from "express";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentRepository } from "./repositories/payment.repository";
import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import { body } from "express-validator";
import { OrderRepository } from "./repositories/order.repository";

const router = express.Router();
const paymentRepository = new PaymentRepository();
const orderRepository = new OrderRepository();
const paymentService = new PaymentService(paymentRepository, orderRepository);
const paymentController = new PaymentController(paymentService);

/**
 * @route POST /api/payments
 * @description Create a new payment
 * @access Private
 * @returns {Object} Payment object
 */
router.post("/", [
	requireAuth,
	body("token").not().isEmpty().withMessage("Token is required"),
	body("orderId").not().isEmpty().withMessage("Order ID is required"),
	validateRequest,
	paymentController.createPayment.bind(paymentController),
]);

export { router as paymentRoutes };
