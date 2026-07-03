import { Document, Types } from "mongoose";
import { SessionStatus } from "./enums";

export interface ISession extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status?: SessionStatus;
    numberOfTeams?: number | null;
    questions?: Types.ObjectId[] | string[];
    companyName?: string;
    companyLogo?: Types.ObjectId | any;
}