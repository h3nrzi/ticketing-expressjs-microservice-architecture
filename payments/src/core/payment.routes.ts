import express from "express";

const router = express.Router();

router.post("/create", (req, res) => {
	res.send("Hello World");
});

export { router as paymentRoutes };
