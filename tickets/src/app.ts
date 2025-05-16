import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { NotFoundError, errorHandler, currentUser } from "@h3nrzi-ticket/common";
import { newTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketsRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
	}),
);

app.use(currentUser);

// ==========================================
// API Documentation
// ==========================================

app.use("/api/tickets/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// Routes
// ==========================================

app.use(newTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketsRouter);
app.use(updateTicketRouter);
// ==========================================
// Error Handling
// ==========================================

app.all("*", async () => {
	throw new NotFoundError("Route not found!");
});

app.use(errorHandler);

export default app;
