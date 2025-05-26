import mongoose from "mongoose";

export interface ITicket {
	title: string;
	price: number;
}

export interface ITicketDoc extends mongoose.Document, ITicket {}
export interface ITicketModel extends mongoose.Model<ITicketDoc> {
	build(attrs: ITicket): ITicketDoc;
}
