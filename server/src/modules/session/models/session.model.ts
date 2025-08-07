import { Schema, model } from 'mongoose';
import { ISession } from '../types/interfaces';
import { SessionStatus } from '../types/enums';

const sessionSchema = new Schema<ISession>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: SessionStatus,
        default: 'pending'
    },
    numberOfTeams: { type: Number, default: null },
}, {
    timestamps: true
});

export const Session = model<ISession>('Session', sessionSchema);
export { ISession };