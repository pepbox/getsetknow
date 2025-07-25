import { Schema, model } from 'mongoose';
import { IPlayer } from '../types/interfaces';


const PlayerSchema = new Schema<IPlayer>({
    name: { type: String, required: true },
    profilePhoto: { type: String },
    session: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    score: { type: Number, default: 0 },
}, {
    timestamps: true
});

export const Player = model<IPlayer>('Player', PlayerSchema);