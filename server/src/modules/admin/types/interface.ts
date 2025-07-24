import { Types } from "mongoose";

export interface IAdmin {
    name: string;
    password: string;
    session: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
