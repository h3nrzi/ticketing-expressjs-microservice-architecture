import { BadRequestError, JwtService } from "@h3nrzi-ticket/common";
import { IUserDocument } from "../domain/user.interface";
import { IUserRepository } from "../infrastructure/user.repository";

export interface IAuthService {
	signup(
		email: string,
		password: string
	): Promise<{ user: IUserDocument; token: string }>;
	signin(
		email: string,
		password: string
	): Promise<{ user: IUserDocument; token: string }>;
	getCurrentUser(userId: string): Promise<IUserDocument | null>;
}

export class AuthService implements IAuthService {
	constructor(private userRepository: IUserRepository) {}

	async signup(email: string, password: string) {
		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new BadRequestError("Email in use");
		}

		const user = await this.userRepository.create({ email, password });
		const token = JwtService.sign({ id: user.id, email: user.email });

		return { user, token };
	}

	async signin(email: string, password: string) {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new BadRequestError("Invalid credentials");
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			throw new BadRequestError("Invalid credentials");
		}

		const token = JwtService.sign({ id: user.id, email: user.email });
		return { user, token };
	}

	async getCurrentUser(userId: string) {
		return this.userRepository.findById(userId);
	}
}
