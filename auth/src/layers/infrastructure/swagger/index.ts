export const swaggerSpec = {
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
	],
	paths: {
		"/api/users/signup": {
			post: {
				tags: ["Auth"],
				summary: "Sign up a new user",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["email", "password"],
								properties: {
									email: {
										type: "string",
										format: "email",
									},
									password: {
										type: "string",
										minLength: 4,
										maxLength: 20,
									},
								},
							},
						},
					},
				},
				responses: {
					"201": {
						description: "User created successfully",
					},
				},
			},
		},
	},
};
