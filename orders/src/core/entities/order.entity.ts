import { OrderStatus } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";
import { IOrder, IOrderDoc, IOrderModel } from "../interfaces/order.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const orderSchema = new mongoose.Schema<IOrderDoc>(
	{
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Ticket",
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrder): IOrderDoc => {
	return new Order(attrs);
};

export const Order = mongoose.model<IOrderDoc, IOrderModel>(
	"Order",
	orderSchema
);
