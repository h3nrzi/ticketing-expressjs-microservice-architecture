import mongoose from "mongoose";

export interface ICharge {
	orderId: string;
	amount: number;
}

export interface IChargeDoc extends mongoose.Document {
	orderId: string;
	amount: number;
}

export interface IChargeModel extends mongoose.Model<IChargeDoc> {
	build(attrs: ICharge): IChargeDoc;
}
