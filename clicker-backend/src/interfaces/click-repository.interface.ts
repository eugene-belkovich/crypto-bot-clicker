import {ClientSession} from 'mongoose';
import {IClickDocument} from '../models';

export interface ClickData {
    timestamp: string;
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

export interface IClickRepository {
    saveClicks(userId: string, clicks: ClickData[], session?: ClientSession): Promise<IClickDocument[]>;

    getScoreByUserId(userId: string): Promise<number>;
}
