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

router.post("/", requireAuth, [
	body("ticketId")
		.notEmpty()
		.withMessage("TicketId must be provided")
		.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
		.withMessage("TicketId must be a valid MongoDB ID"),
	validateRequest,
	orderController.createOrder.bind(orderController),
]);

router.get("/:id", (req, res) => {
	res.send("Hello World");
});

router.delete("/:id", (req, res) => {
	res.send("Hello World");
});

export { router as orderRoutes };
