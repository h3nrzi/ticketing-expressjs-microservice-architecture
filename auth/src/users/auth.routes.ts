import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "@h3nrzi-ticket/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "./user.repository";

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post(
	// route
	"/api/users/signup",
	// validation rules
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	// validateRequest is a middleware that validates the request
	validateRequest,
	// bind the controller method to the router
	authController.signup.bind(authController)
);

router.post(
	// route
	"/api/users/signin",
	// validation rules
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password").trim().notEmpty().withMessage("Password is required"),
	],
	// validateRequest is a middleware that validates the request
	validateRequest,
	// bind the controller method to the router
	authController.signin.bind(authController)
);

router.get(
	// route
	"/api/users/currentuser",
	// bind the controller method to the router
	authController.getCurrentUser.bind(authController)
);

router.post(
	// route
	"/api/users/signout",
	// bind the controller method to the router
	authController.signout.bind(authController)
);

export { router as authRouter };
