import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { IUserDocument, IUserModel } from "./user.interface";

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
// Methods
// ===============================

// Compare password for authentication
userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

// ===============================
// User Model
// ===============================

export const User = mongoose.model<IUserDocument, IUserModel>(
	"User",
	userSchema
);
