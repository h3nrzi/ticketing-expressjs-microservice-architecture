import mongoose from "mongoose";
import {
	ITicket,
	ITicketDocument,
	ITicketModel,
} from "../interfaces/ticket.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema = new mongoose.Schema<ITicketDocument>(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
			default: null,
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ITicket) => {
	return new TicketModel(attrs);
};

export const TicketModel = mongoose.model<ITicketDocument, ITicketModel>(
	"Ticket",
	ticketSchema
);
