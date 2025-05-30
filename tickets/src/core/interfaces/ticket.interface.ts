import { Document, Model } from "mongoose";

export interface ITicket {
	title: string;
	price: number;
	userId: string;
}

export interface ITicketDocument extends Document {
	title: string;
	price: number;
	userId: string;
	version: number;
}

export interface ITicketModel extends Model<ITicketDocument> {
	build(attrs: ITicket): ITicketDocument;
}
