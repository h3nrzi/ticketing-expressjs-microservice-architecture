import express from "express";
import { ChargeController } from "./charge.controller";
import { ChargeService } from "./charge.service";
import { ChargeRepository } from "./repositories/charge.repository";
import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import { body } from "express-validator";
import { OrderRepository } from "./repositories/order.repository";

const router = express.Router();
const chargeRepository = new ChargeRepository();
const orderRepository = new OrderRepository();
const chargeService = new ChargeService(chargeRepository, orderRepository);
const chargeController = new ChargeController(chargeService);

/**
 * @route POST /api/charges
 * @description Create a new charge
 * @access Private
 * @returns {Object} Charge object
 */
router.post("/", [
	requireAuth,
	body("token").not().isEmpty().withMessage("Token is required"),
	body("orderId").not().isEmpty().withMessage("Order ID is required"),
	validateRequest,
	chargeController.createCharge.bind(chargeController),
]);

export { router as chargeRoutes };
