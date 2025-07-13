import { Document } from "mongoose";

export interface ISession extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}