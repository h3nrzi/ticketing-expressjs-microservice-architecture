import mongoose from "mongoose";
import { IUser, IUserDocument } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	},
);

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await bcrypt.hash(this.password, 10);
		this.password = hashed;
	}
	done();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

interface UserModel extends mongoose.Model<IUserDocument> {
	build(attrs: Omit<IUser, "id" | "createdAt" | "updatedAt">): IUserDocument;
}

userSchema.statics.build = (attrs: Omit<IUser, "id" | "createdAt" | "updatedAt">) => {
	return new User(attrs);
};

export const User = mongoose.model<IUserDocument, UserModel>("User", userSchema);
