import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import { Router } from "express";
import { body } from "express-validator";
import { TicketController } from "./ticket.controller";
import { TicketRepository } from "./ticket.repository";
import { TicketService } from "./ticket.service";

const router = Router();
const ticketRepository = new TicketRepository();
const ticketService = new TicketService(ticketRepository);
const ticketController = new TicketController(ticketService);

/**
 * @description Create a new ticket
 * @route POST /api/tickets
 * @access Private
 * @param {string} title - The title of the ticket
 * @param {number} price - The price of the ticket
 * @returns {ITicketDocument} The created ticket
 */
router.post("/", requireAuth, [
	body("title").not().isEmpty().withMessage("Title is required"),
	body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
	validateRequest,
	ticketController.createTicket.bind(ticketController),
]);

/**
 * @description Get a ticket by id
 * @route GET /api/tickets/:id
 * @access Public
 * @param {string} id - The id of the ticket
 * @returns {ITicketDocument} The ticket
 */
router.get("/:id", ticketController.getTicketById.bind(ticketController));

/**
 * @description Update a ticket
 * @route PATCH /api/tickets/:id
 * @access Private
 * @param {string} id - The id of the ticket
 * @param {string} title - The title of the ticket
 * @param {number} price - The price of the ticket
 * @returns {ITicketDocument} The updated ticket
 */
router.patch("/:id", [
	requireAuth,
	body("title").not().isEmpty().withMessage("Title is required"),
	body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
	validateRequest,
	ticketController.updateTicket.bind(ticketController),
]);

export { router as ticketRoutes };
