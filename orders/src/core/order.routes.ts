import { requireAuth, validateRequest } from "@h3nrzi-ticket/common";
import { body } from "express-validator";
import { Request, Response } from "express";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.post(
	"/",
	requireAuth,
	[
		body("ticketId")
			.notEmpty()
			.withMessage("TicketId must be provided")
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("TicketId must be a valid MongoDB ID"),
		validateRequest,
	],
	(req: Request, res: Response) => {
		res.send("Hello World");
	}
);

router.get("/:id", (req, res) => {
	res.send("Hello World");
});

router.delete("/:id", (req, res) => {
	res.send("Hello World");
});

export { router as orderRoutes };
