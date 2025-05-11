import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@h3nrzi-ticket/common";
const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
	// Find the ticket with the given id, if not found, throw a not found error
	const ticket = await Ticket.findById(req.params.id);
	if (!ticket) throw new NotFoundError("Ticket not found");

	// Send the ticket
	res.status(200).send(ticket);
});

export { router as showTicketRouter };
