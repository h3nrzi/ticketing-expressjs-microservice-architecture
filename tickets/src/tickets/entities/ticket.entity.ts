import mongoose from "mongoose";
import {
	ITicket,
	ITicketDocument,
	ITicketModel,
} from "../interfaces/ticket.interface";

// ==========================================
// Ticket Schema
// ==========================================

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

// ==========================================
// Methods
// ==========================================

ticketSchema.statics.build = (attrs: ITicket) => {
	return new TicketModel(attrs);
};

// ==========================================
// Ticket Model
// ==========================================

export const TicketModel = mongoose.model<ITicketDocument, ITicketModel>(
	"Ticket",
	ticketSchema
);
