import mongoose, { Document, Types } from "mongoose";

export interface IPlayer extends Document {
    _id: Types.ObjectId;
    name: string;
    profilePhoto: mongoose.Types.ObjectId;
    score?: number;
    session: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IGuess extends Document {
    user: Types.ObjectId;
    personId: Types.ObjectId;
    guessedPersonId: Types.ObjectId;
    attempts?: number;
    createdAt: Date;
    updatedAt: Date;
}
