import {
	IUser,
	IUserDocument,
	IUserRepository,
} from "../interfaces/user.interface";
import { User } from "../entities/user.entity";

export class UserRepository implements IUserRepository {
	async findByEmail(email: string): Promise<IUserDocument | null> {
		return User.findOne({ email });
	}

	async create(
		userData: Omit<IUser, "id" | "createdAt" | "updatedAt">
	): Promise<IUserDocument> {
		const user = User.build(userData);
		await user.save();
		return user;
	}

	async findById(id: string): Promise<IUserDocument | null> {
		return User.findById(id);
	}
}
