import mongoose from "mongoose";

export interface IUser {
	email: string;
	password: string;
}

export interface IUserDocument extends mongoose.Document, IUser {
	comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {}
