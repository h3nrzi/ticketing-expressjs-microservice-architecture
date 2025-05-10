import swaggerJsdoc from "swagger-jsdoc";
import YAML from "yaml";
import fs from "fs";
import path from "path";

// Paths to YAML files
const schemasPath = path.join(__dirname, "../swagger/schemas.yaml");
const pathsPath = path.join(__dirname, "../swagger/paths.yaml");

// Read YAML files
const schemasYaml = fs.readFileSync(schemasPath, "utf8");
const pathsYaml = fs.readFileSync(pathsPath, "utf8");

// Parse YAML files
const schemas = YAML.parse(schemasYaml);
const paths = YAML.parse(pathsYaml);

// Swagger options
const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Auth Service API",
			version: "1.0.0",
			description: "API documentation for the Auth Service",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
			{
				url: "https://ticketing.dev",
				description: "Production server",
			},
		],
		components: {
			...schemas.components,
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "session",
				},
			},
		},
		paths: paths.paths,
		security: [
			{
				cookieAuth: [],
			},
		],
	},
	apis: [], // We don't need this anymore as we're using YAML files
};

export const swaggerSpec = swaggerJsdoc(options);
