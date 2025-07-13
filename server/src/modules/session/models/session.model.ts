import { Schema, model } from 'mongoose';
import { ISession } from '../types/interfaces';

const sessionSchema = new Schema<ISession>({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export const Session = model<ISession>('Session', sessionSchema);
export { ISession };