import mongoose, { Model, Document, Schema } from "mongoose";
import { PasswordManager } from "@h3nrzi-ticket/common";

//----------------------------------------
// Type Definitions
//----------------------------------------

interface UserAttrs {
	email: string;
	password: string;
}

interface UserDoc extends Document {
	email: string;
	password: string;
	updatedAt: string;
	createdAt: string;
}

interface UserModel extends Model<UserDoc> {
	build: (attrs: UserAttrs) => UserDoc;
}

//----------------------------------------
// Schema Definition
//----------------------------------------

const userSchema = new Schema(
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
		// Disable version key (__v)
		versionKey: false,
		// Transform the response to exclude certain fields
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
			},
		},
	}
);

//----------------------------------------
// Schema Methods
//----------------------------------------

// Static method to build a User
userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

// Hash the password before saving the user
userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await PasswordManager.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
});

//----------------------------------------
// Model Creation & Export
//----------------------------------------

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export default User;
