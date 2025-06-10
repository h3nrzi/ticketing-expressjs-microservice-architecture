import express from "express";
import { configureMiddleware } from "./config/middleware";
import { configureSwagger } from "./config/swagger";
import { paymentRoutes } from "./core/payment.routes";
import { errorHandler, NotFoundError } from "@h3nrzi-ticket/common";

const app = express();

configureMiddleware(app);
configureSwagger(app);

app.use("/api/payments", paymentRoutes);

app.all("*", async () => {
	throw new NotFoundError("Route not found!");
});

app.use(errorHandler);

export default app;
