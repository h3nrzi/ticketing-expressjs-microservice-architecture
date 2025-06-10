import express from "express";
import { ChargeController } from "./charge.controller";
import { ChargeService } from "./charge.service";
import { ChargeRepository } from "./charge.repository";
import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import { body } from "express-validator";

const router = express.Router();
const chargeRepository = new ChargeRepository();
const chargeService = new ChargeService(chargeRepository);
const chargeController = new ChargeController(chargeService);

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
	chargeController.createCharge.bind(chargeController),
]);

export { router as chargeRoutes };
