import { OrderStatus } from "@h3nrzi-ticket/common";
import mongoose from "mongoose";

export interface IOrder {
	id: string;
	userId: string;
	version: number;
	status: OrderStatus;
	ticketPrice: number;
}

export interface IOrderDoc extends mongoose.Document {
	userId: string;
	version: number;
	status: OrderStatus;
	ticketPrice: number;
}

export interface IOrderModel extends mongoose.Model<IOrderDoc> {
	build(attrs: IOrder): IOrderDoc;
}
