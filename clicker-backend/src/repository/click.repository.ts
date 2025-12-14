import {injectable} from 'inversify';
import {ClickData, IClickRepository} from '../interfaces';
import {Click} from '../models';
import {catchError} from '../errors';

@injectable()
export class ClickRepository implements IClickRepository {
    saveClicks = catchError(async (userId: string, clicks: ClickData[]): Promise<number> => {
        if (!clicks?.length) return 0;

        const batch = clicks.map(click => ({
            updateOne: {
                filter: {userId, timestamp: new Date(click.timestamp)},
                update: {
                    $setOnInsert: {
                        userId,
                        timestamp: new Date(click.timestamp),
                        x: click.x,
                        y: click.y,
                        metadata: click.metadata
                    }
                },
                upsert: true
            }
        }));

        const res = await Click.bulkWrite(batch, {ordered: false});
        return res.upsertedCount || 0;
    });

    getScoreByUserId = catchError(async (userId: string): Promise<number> => {
        return Click.countDocuments({userId});
    });
}
