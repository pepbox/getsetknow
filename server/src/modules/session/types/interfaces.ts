import { Document } from "mongoose";
import { SessionStatus } from "./enums";

export interface ISession extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status?: SessionStatus;
}