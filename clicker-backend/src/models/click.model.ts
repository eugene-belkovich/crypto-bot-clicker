import {Document, Model, model, Schema, Types} from 'mongoose';

export interface IClick {
    _id: Types.ObjectId;
    userId: string;
    timestamp: Date;
    x: number;
    y: number;
    metadata?: {
        userAgent?: string;
        hasTouchEvents?: boolean;
        hasOrientation?: boolean;
        hasOrientationEvent?: boolean;
        hasMotionEvent?: boolean;
        timeZone?: string;
    };
}

export type IClickDocument = IClick & Document;

const clickSchema = new Schema<IClickDocument>(
    {
        userId: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        x: {
            type: Number,
            required: true,
            min: -100000,
            max: 100000,
        },
        y: {
            type: Number,
            required: true,
            min: -100000,
            max: 100000,
        },
        metadata: {
            userAgent: String,
            hasTouchEvents: Boolean,
            hasOrientation: Boolean,
            hasOrientationEvent: Boolean,
            hasMotionEvent: Boolean,
            timeZone: String,
        },
    },
    {
        timeseries: {
            timeField: 'timestamp',
            metaField: 'userId',
            granularity: 'seconds',
        },
        expireAfterSeconds: 60 * 60 * 24 * 90, // 90 days TTL
    }
);

clickSchema.index({userId: 1, timestamp: 1}, {unique: true});

export const Click: Model<IClickDocument> = model<IClickDocument>('Click', clickSchema);
