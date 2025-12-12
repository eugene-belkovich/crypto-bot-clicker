import {Document, Model, model, Schema, Types} from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}

export type IUserDocument = IUser & Document;

const userSchema = new Schema<IUserDocument>(
    {
        telegramId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        username: {
            type: String,
            default: null,
        },
        firstName: {
            type: String,
            default: null,
        },
        lastName: {
            type: String,
            default: null,
        },
        clicks: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.index({points: -1});

export const User: Model<IUserDocument> = model<IUserDocument>('User', userSchema);
