import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger/swagger";
import { Express } from "express";

export function configureSwagger(app: Express) {
	app.use("/api/payments/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
