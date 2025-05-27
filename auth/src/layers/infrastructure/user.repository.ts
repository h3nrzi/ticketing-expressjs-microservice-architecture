import { IUser, IUserDocument } from "../domain/user.interface";
import { User } from "../domain/user.entity";

export interface IUserRepository {
	findByEmail(email: string): Promise<IUserDocument | null>;
	create(user: IUser): Promise<IUserDocument>;
	findById(id: string): Promise<IUserDocument | null>;
}

export class UserRepository implements IUserRepository {
	findByEmail(email: string) {
		return User.findOne({ email });
	}

	create(userData: IUser) {
		return User.create(userData);
	}

	findById(id: string) {
		return User.findById(id);
	}
}
