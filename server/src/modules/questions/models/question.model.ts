import { Schema, model } from 'mongoose';
import { IQuestion } from '../types/interfaces';


const questionSchema = new Schema<IQuestion>({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    keyAspect: {
        type: String,
        required: true,
        trim: true
    },
    questionImage: {
        type: String,
        required: false,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

export const Question = model<IQuestion>('Question', questionSchema);