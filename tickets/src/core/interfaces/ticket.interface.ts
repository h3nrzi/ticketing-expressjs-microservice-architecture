import mongoose from "mongoose";

export interface ITicket {
	title: string;
	price: number;
	userId: string;
}

export interface ITicketDocument extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	version: number;
	orderId: string | null;
}

export interface ITicketModel extends mongoose.Model<ITicketDocument> {
	build(attrs: ITicket): ITicketDocument;
}
