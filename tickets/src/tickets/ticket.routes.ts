import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import { Router } from "express";
import { body, param } from "express-validator";
import { TicketController } from "./ticket.controller";
import { TicketRepository } from "./ticket.repository";
import { TicketService } from "./ticket.service";

const router = Router();
const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);
const ticketController = new TicketController(ticketService);

/**
 * @description Get all tickets
 * @returns {Promise<void>} - A promise that resolves to void
 */
router.get("/", ticketController.getAllTickets.bind(ticketController));

/**‌
 * @description Create a new ticket
 * @param {string} title - The title of the ticket
 * @param {number} price - The price of the ticket
 * @returns {Promise<void>} - A promise that resolves to void
 */
router.post("/", requireAuth, [
	body("title").not().isEmpty().withMessage("Title is required"),
	body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
	validateRequest,
	ticketController.createTicket.bind(ticketController),
]);

/**
 * @description Get a ticket by id
 * @param {string} id - The id of the ticket
 * @returns {Promise<void>} - A promise that resolves to void
 */
router.get("/:id", ticketController.getTicketById.bind(ticketController));

/**
 * @description Update a ticket
 * @param {string} id - The id of the ticket
 * @param {string} title - The title of the ticket
 * @param {number} price - The price of the ticket
 * @returns {Promise<void>} - A promise that resolves to void
 */
router.patch("/:id", [
	requireAuth,
	body("title").not().isEmpty().withMessage("Title is required"),
	body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
	validateRequest,
	ticketController.updateTicket.bind(ticketController),
]);

/**
 * @description Delete a ticket
 * @param {string} id - The id of the ticket
 * @returns {Promise<void>} - A promise that resolves to void
 */
router.delete("/:id", [
	requireAuth,
	param("id").not().isEmpty().withMessage("Ticket ID is required"),
	validateRequest,
	ticketController.deleteTicket.bind(ticketController),
]);

export { router as ticketRoutes };
