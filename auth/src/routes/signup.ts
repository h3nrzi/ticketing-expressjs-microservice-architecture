import express, { Request, Response } from "express";
import { body } from "express-validator";
import User from "../models/user";
import {
	BadRequestError,
	JwtService,
	validateRequest,
} from "@h3nrzi-ticket/common";

const router = express.Router();

router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Email must be valid."),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		// destructure email and password from request body
		const { email, password } = req.body;

		// check if user already exists
		// if user exists, throw a BadRequestError
		const existingUser = await User.findOne({ email });
		if (existingUser) throw new BadRequestError("Email in use");

		// create a new user and save to database
		const user = User.build({ email, password });
		await user.save();

		// generate JWT token
		const userJwt = JwtService.sign({
			email,
			id: user.id,
		});

		// store JWT token in session
		req.session = { jwt: userJwt };

		return res.status(201).json(user);
	}
);

export { router as signupRouter };
