import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger";
import {
	NotFoundError,
	errorHandler,
	currentUser,
} from "@h3nrzi-ticket/common";
import { ticketRoutes } from "./core/ticket.routes";

// ==========================================
// Initialize Express Application
// ==========================================

const app = express();

// ==========================================
// Security & Trust Configuration
// ==========================================

app.set("trust proxy", true);

// ==========================================
// Middleware Configuration
// ==========================================

app.use(bodyParser.json());

app.use(
	cookieSession({
		signed: false,
		secure: false,
		httpOnly: true,
		// sameSite: "none",
		// path: "/",
	})
);

app.use(currentUser);

// ==========================================
// API Documentation
// ==========================================

app.use("/api/tickets/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// Routes
// ==========================================

app.use("/api/tickets", ticketRoutes);
// ==========================================
// Error Handling
// ==========================================

app.all("*", async () => {
	throw new NotFoundError("Route not found!");
});

app.use(errorHandler);

export default app;
