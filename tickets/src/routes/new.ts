import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
	"/api/tickets",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be greater than 0"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		// Extract the title and price from the request body
		const { title, price } = req.body;

		// Create a new ticket
		const ticket = Ticket.build({
			title,
			price,
			userId: req.currentUser!.id,
		});

		// Save the ticket to the database
		await ticket.save();

		// Send the ticket as a response
		res.status(201).send(ticket);
	}
);

export { router as newTicketRouter };
