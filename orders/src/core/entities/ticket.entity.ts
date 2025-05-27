import mongoose from "mongoose";
import { ITicketDoc, ITicketModel } from "../interfaces/ticket.interface";

const ticketSchema = new mongoose.Schema<ITicketDoc>(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>(
	"Ticket",
	ticketSchema
);
