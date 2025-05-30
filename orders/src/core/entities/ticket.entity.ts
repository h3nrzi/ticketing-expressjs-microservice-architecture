import mongoose from "mongoose";
import {
	ITicket,
	ITicketDoc,
	ITicketModel,
	IEvent,
} from "../interfaces/ticket.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

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
			},
		},
	}
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: ITicket): ITicketDoc => {
	return new Ticket({ ...attrs, _id: attrs.id });
};

ticketSchema.statics.findByEvent = async (
	event: IEvent
): Promise<ITicketDoc | null> => {
	return Ticket.findOne({
		_id: event.id,
		version: event.version - 1,
	});
};

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>(
	"Ticket",
	ticketSchema
);
