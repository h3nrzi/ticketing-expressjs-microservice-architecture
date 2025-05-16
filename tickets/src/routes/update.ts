import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from "@h3nrzi-ticket/common";
import { body } from "express-validator";

const router = express.Router();

router.patch(
	"/api/tickets/:id",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price").isFloat({ gt: 0 }).withMessage("Price must be provided and greater than 0"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;

		const ticket = await Ticket.findById(req.params.id);
		if (!ticket) {
			throw new NotFoundError("Ticket not found");
		}

		if (req.currentUser?.id !== ticket.userId) {
			throw new NotAuthorizedError();
		}

		ticket.set({ title, price });

		await ticket.save();

		return res.status(200).send(ticket);
	},
);

export { router as updateTicketRouter };
