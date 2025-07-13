import { Document, Types } from "mongoose";

export interface IPlayer extends Document {
    name: string;
    profilePhoto: string;
    session: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IGuess extends Document {
    user: Types.ObjectId;
    personId: Types.ObjectId;
    guessedPersonId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
