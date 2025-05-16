import mongoose, { Model, Document, Schema } from "mongoose";

//----------------------------------------
// Type Definitions
//----------------------------------------

interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
}

interface TicketDoc extends Document {
	title: string;
	price: number;
	userId: string;
}

interface TicketModel extends Model<TicketDoc> {
	build: (attrs: TicketAttrs) => TicketDoc;
}

//----------------------------------------
// Schema Definition
//----------------------------------------

const ticketSchema = new Schema(
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
				delete ret.version;
			},
		},
	},
);

//----------------------------------------
// Schema Methods
//----------------------------------------

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

//----------------------------------------
// Model Creation
//----------------------------------------

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
