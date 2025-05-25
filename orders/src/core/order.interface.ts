import mongoose from "mongoose";

export enum OrderStatus {
	Created = "created",
	Pending = "pending",
	Complete = "complete",
	Failed = "failed",
}

export interface IOrder {
	userId: string; // id of user who created the order
	status: OrderStatus; // created, pending, complete, failed
	expiresAt: Date; // date when order expires
	ticket: ITicketDoc; // ref to ticket document
}

export interface IOrderDoc extends mongoose.Document, IOrder {}
export interface IOrderModel extends mongoose.Model<IOrderDoc> {
	build(attrs: IOrder): IOrderDoc;
}
