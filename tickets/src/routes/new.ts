import express from "express";

const router = express.Router();

router.post("/api/tickets", (req, res) => {
	return res.json({ message: "Hello World" });
});

export { router as newTicketRouter };
