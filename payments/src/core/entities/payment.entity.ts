import mongoose from "mongoose";
import { IPaymentDoc, IPaymentModel } from "../interfaces/payment.interface";
import { IPayment } from "../interfaces/payment.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const paymentSchema = new mongoose.Schema<IPaymentDoc>(
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

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: IPayment) => {
	return new Payment(attrs);
};

export const Payment = mongoose.model<IPaymentDoc, IPaymentModel>(
	"Payment",
	paymentSchema
);
