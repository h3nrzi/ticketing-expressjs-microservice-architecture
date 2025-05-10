import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { NotFoundError, errorHandler } from "@h3nrzi-ticket/common";

const app = express();

// To enable trust proxy for secure cookies
app.set("trust proxy", true);

// To parse JSON requests
app.use(bodyParser.json());

// To handle cookie sessions
app.use(
	cookieSession({
		signed: false, // Disable signing of cookies
		secure: false, // Only send over HTTPS in production
		httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
		// sameSite: "none", // Allow cookies to be sent to any site
		// path: "/", // Set the path to the root of the domain
	})
);

// Swagger UI setup
app.use("/api/tickets/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Catch-all route for handling undefined routes
app.all("*", async () => {
	throw new NotFoundError("Route not found!");
});

// Handle errors
app.use(errorHandler);

export default app;
