import mongoose from "mongoose";
import { IUser, IUserDocument } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";

// ===============================
// User Schema
// ===============================

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
		// Transform the document when converting to JSON
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

// ===============================
// Middlewares
// ===============================

// Hash password before saving
userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await bcrypt.hash(this.password, 10);
		this.password = hashed;
	}
	done();
});

// ===============================
// Document Methods
// ===============================

// Compare password for authentication
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

// ===============================
// Static Methods
// ===============================

interface UserModel extends mongoose.Model<IUserDocument> {
	build(attrs: Omit<IUser, "id" | "createdAt" | "updatedAt">): IUserDocument;
}

// Create new user instances
userSchema.statics.build = (attrs: Omit<IUser, "id" | "createdAt" | "updatedAt">) => {
	return new User(attrs);
};

export const User = mongoose.model<IUserDocument, UserModel>("User", userSchema);
