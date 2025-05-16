export interface IUser {
	id: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUserDocument extends IUser {
	comparePassword(candidatePassword: string): Promise<boolean>;
	save(): Promise<IUserDocument>;
}

export interface IUserRepository {
	findByEmail(email: string): Promise<IUserDocument | null>;
	create(user: Omit<IUser, "id" | "createdAt" | "updatedAt">): Promise<IUserDocument>;
	findById(id: string): Promise<IUserDocument | null>;
}

export interface IAuthService {
	signup(email: string, password: string): Promise<{ user: IUserDocument; token: string }>;
	signin(email: string, password: string): Promise<{ user: IUserDocument; token: string }>;
	getCurrentUser(userId: string): Promise<IUserDocument | null>;
}
