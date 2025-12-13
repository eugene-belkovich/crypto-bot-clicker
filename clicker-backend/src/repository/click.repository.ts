import {injectable} from 'inversify';
import {ClientSession} from 'mongoose';
import {ClickData, IClickRepository} from '../interfaces';
import {Click, IClickDocument} from '../models';
import {catchError} from '../errors';

@injectable()
export class ClickRepository implements IClickRepository {
    saveClicks = catchError(
        async (userId: string, clicks: ClickData[], session?: ClientSession): Promise<IClickDocument[]> => {
            const clickDocs = clicks.map((click) => ({
                userId,
                timestamp: new Date(click.timestamp),
                x: click.x,
                y: click.y,
                metadata: click.metadata,
            }));

            return Click.insertMany(clickDocs, {session});
        }
    );

    getScoreByUserId = catchError(async (userId: string): Promise<number> => {
        return Click.countDocuments({userId});
    });
}
