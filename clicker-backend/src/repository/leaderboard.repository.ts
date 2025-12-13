import {injectable} from 'inversify';
import {ILeaderboardRepository, LeaderboardEntry} from '../interfaces';
import {User} from '../models';
import {catchError} from '../errors';

@injectable()
export class LeaderboardRepository implements ILeaderboardRepository {
    getTopUsers = catchError(async (limit: number): Promise<LeaderboardEntry[]> => {
        const users = await User.find().sort({score: -1}).limit(limit).lean();

        return users.map((user, index) => ({
            rank: index + 1,
            telegramId: user.telegramId,
            username: user.username ?? null,
            firstName: user.firstName ?? null,
            score: user.score,
        }));
    });

    getUserRank = catchError(async (telegramId: string): Promise<number> => {
        const user = await User.findOne({telegramId}).lean();

        if (!user) {
            return 0;
        }

        const usersWithHigherScore = await User.countDocuments({
            score: {$gt: user.score},
        });

        return usersWithHigherScore + 1;
    });
}
