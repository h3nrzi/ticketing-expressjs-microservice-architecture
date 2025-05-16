import { BadRequestError, JwtService } from "@h3nrzi-ticket/common";
import { IAuthService, IUserDocument } from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repository";

export class AuthService implements IAuthService {
	constructor(private userRepository: UserRepository) {}

	async signup(email: string, password: string): Promise<{ user: IUserDocument; token: string }> {
		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new BadRequestError("Email in use");
		}

		const user = await this.userRepository.create({ email, password });
		const token = JwtService.sign({ id: user.id, email: user.email });

		return { user, token };
	}

	async signin(email: string, password: string): Promise<{ user: IUserDocument; token: string }> {
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

	async getCurrentUser(userId: string): Promise<IUserDocument | null> {
		return this.userRepository.findById(userId);
	}
}
