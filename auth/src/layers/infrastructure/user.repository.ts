import {
	IUser,
	IUserDocument,
	IUserRepository,
} from "../domain/user.interface";
import { User } from "../domain/user.entity";

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
