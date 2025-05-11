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
