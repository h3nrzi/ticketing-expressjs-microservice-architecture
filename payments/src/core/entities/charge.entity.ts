import mongoose from "mongoose";
import { IChargeDoc, IChargeModel } from "../interfaces/charge.interface";
import { ICharge } from "../interfaces/charge.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const chargeSchema = new mongoose.Schema<IChargeDoc>(
	{
		amount: {
			type: Number,
			required: true,
		},
		orderId: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

chargeSchema.set("versionKey", "version");
chargeSchema.plugin(updateIfCurrentPlugin);

chargeSchema.statics.build = (attrs: ICharge) => {
	return new Charge(attrs);
};

export const Charge = mongoose.model<IChargeDoc, IChargeModel>(
	"Charge",
	chargeSchema
);
