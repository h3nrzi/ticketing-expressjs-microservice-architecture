import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import express from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderRepository } from "./repositories/order.repository";
import { TicketRepository } from "./repositories/ticket.repository";

const router = express.Router();
const orderRepository = new OrderRepository();
const ticketRepository = new TicketRepository();
const orderService = new OrderService(orderRepository, ticketRepository);
const orderController = new OrderController(orderService);

/**
 * @route GET /api/orders
 * @description Get all orders for the current user
 * @access Private
 * @returns {Order[]} 200 - The orders were found successfully
 * @returns {Error} 401 - The user is not authenticated or the user cannot access this resource
 */
router.get("/", [
	requireAuth,
	orderController.findOrdersByUserId.bind(orderController),
]);

/**
 * @route POST /api/orders
 * @description Reserve a ticket
 * @access Private
 * @returns {Order} 201 - The order was created successfully
 * @returns {Error} 400 - Bad Request
 * @returns {Error} 401 - The user is not authenticated or the user cannot access this resource
 */
router.post("/", [
	requireAuth,
	body("ticketId")
		.notEmpty()
		.withMessage("TicketId must be provided")
		.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
		.withMessage("TicketId must be a valid MongoDB ID"),
	validateRequest,
	orderController.createOrder.bind(orderController),
]);

/**
 * @route GET /api/orders/:id
 * @description Get an order by ID
 * @access Private
 * @returns {Order} 200 - The order was found successfully
 * @returns {Error} 401 - The user is not authenticated or the user cannot access this resource
 */
router.get("/:id", [
	requireAuth,
	validateRequest,
	orderController.findOrderById.bind(orderController),
]);

/**
 * @route DELETE /api/orders/:id
 * @description Cancel an order
 * @access Private
 * @returns {Order} 200 - The order was cancelled successfully
 * @returns {Error} 401 - The user is not authenticated or the user cannot access this resource
 */
router.delete("/:id", [
	requireAuth,
	orderController.cancelOrder.bind(orderController),
]);

export { router as orderRoutes };
