import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello World");
});

router.post("/", (req, res) => {
	res.send("Hello World");
});

router.get("/:id", (req, res) => {
	res.send("Hello World");
});

router.delete("/:id", (req, res) => {
	res.send("Hello World");
});

export { router as orderRoutes };
