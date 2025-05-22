import { Request, Response } from "express";
import { IAuthService } from "../domain/user.interface";

export class AuthController {
	constructor(private authService: IAuthService) {}

	async signup(req: Request, res: Response) {
		const { email, password } = req.body;
		const { user, token } = await this.authService.signup(email, password);

		req.session = { jwt: token };
		return res.status(201).json(user);
	}

	async signin(req: Request, res: Response) {
		const { email, password } = req.body;
		const { user, token } = await this.authService.signin(email, password);

		req.session = { jwt: token };
		return res.status(200).json(user);
	}

	async getCurrentUser(req: Request, res: Response) {
		if (!req.currentUser) {
			return res.status(200).json({ currentUser: null });
		}

		const user = await this.authService.getCurrentUser(req.currentUser.id);
		return res.status(200).json({ currentUser: user });
	}

	async signout(req: Request, res: Response) {
		req.session = null;
		return res.status(200).send({});
	}
}
