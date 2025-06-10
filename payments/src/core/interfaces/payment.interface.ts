import mongoose from "mongoose";

export interface IPayment {
	orderId: string;
	amount: number;
}

export interface IPaymentDoc extends mongoose.Document {
	orderId: string;
	amount: number;
}

export interface IPaymentModel extends mongoose.Model<IPaymentDoc> {
	build(attrs: IPayment): IPaymentDoc;
}
