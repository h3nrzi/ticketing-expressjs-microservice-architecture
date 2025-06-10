import mongoose from "mongoose";
import { IOrder, IOrderDoc, IOrderModel } from "../interfaces/order.interface";
import { OrderStatus } from "@h3nrzi-ticket/common";
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
		},
		ticketPrice: {
			type: Number,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, returnedObject) {
				returnedObject.id = returnedObject._id;
				delete returnedObject._id;
			},
		},
	}
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrder): IOrderDoc => {
	return new Order({ ...attrs, _id: attrs.id });
};

export const Order = mongoose.model<IOrderDoc, IOrderModel>(
	"Order",
	orderSchema
);
