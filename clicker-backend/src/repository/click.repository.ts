import {injectable} from 'inversify';
import {ClickData, IClickRepository} from '../interfaces';
import {Click, IClickDocument} from '../models';
import {catchAsync} from '../utils';

@injectable()
export class ClickRepository implements IClickRepository {
    saveClicks = catchAsync(async (userId: string, clicks: ClickData[]): Promise<IClickDocument[]> => {
        const clickDocs = clicks.map((click) => ({
            userId,
            timestamp: new Date(click.timestamp),
            x: click.x,
            y: click.y,
            metadata: click.metadata,
        }));

        return Click.insertMany(clickDocs);
    });

    getScoreByUserId = catchAsync(async (userId: string): Promise<number> => {
        return Click.countDocuments({userId});
    });
}
