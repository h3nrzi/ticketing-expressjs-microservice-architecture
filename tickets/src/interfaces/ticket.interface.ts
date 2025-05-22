import { Document, Model } from "mongoose";

export interface ITicket {
	title: string;
	price: number;
	userId: string;
}

export interface ITicketDocument extends ITicket, Document {}

export interface ITicketModel extends Model<ITicketDocument> {
	build(attrs: ITicket): ITicketDocument;
}
