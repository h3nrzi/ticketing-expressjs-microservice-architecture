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

router.get(
	//
	"/",
	ticketController.getAllTickets.bind(ticketController)
);

router.post(
	"/",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be greater than 0"),
	],
	validateRequest,
	ticketController.createTicket.bind(ticketController)
);

router.get(
	//
	"/:id",
	ticketController.getTicketById.bind(ticketController)
);

router.patch(
	"/:id",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be greater than 0"),
	],
	validateRequest,
	ticketController.updateTicket.bind(ticketController)
);

router.delete(
	"/:id",
	requireAuth,
	ticketController.deleteTicket.bind(ticketController)
);

export { router as ticketRoutes };
