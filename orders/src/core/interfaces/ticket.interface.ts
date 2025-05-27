import mongoose from "mongoose";

export interface ITicket {
	title: string;
	price: number;
}

export interface ITicketDoc extends ITicket, mongoose.Document {}
export interface ITicketModel extends mongoose.Model<ITicketDoc> {}
