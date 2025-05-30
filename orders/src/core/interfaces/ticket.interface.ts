import mongoose from "mongoose";

export interface ITicket {
	id: string;
	title: string;
	price: number;
}

export interface ITicketDoc extends mongoose.Document {
	id: string;
	title: string;
	price: number;
	version: number;
}

export interface IEvent {
	id: string;
	version: number;
}

export interface ITicketModel extends mongoose.Model<ITicketDoc> {
	build(attrs: ITicket): ITicketDoc;
	findByEvent(event: IEvent): Promise<ITicketDoc | null>;
}
