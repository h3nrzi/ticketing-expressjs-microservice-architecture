import express from "express";
import { requireAuth } from "@h3nrzi-ticket/common";
const router = express.Router();

router.post("/api/tickets", requireAuth, (req, res) => {
	return res.json({ message: "Hello World" });
});

export { router as newTicketRouter };
