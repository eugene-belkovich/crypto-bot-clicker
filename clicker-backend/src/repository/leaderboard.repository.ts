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
            photoUrl: user.photoUrl ?? null,
            score: user.score,
        }));
    });

    getUserRank = catchError(async (telegramId: string): Promise<number> => {
        const result = await User.aggregate([
            {$sort: {score: -1, _id: 1}},
            {
                $group: {
                    _id: null,
                    users: {$push: {telegramId: '$telegramId'}},
                },
            },
            {$unwind: {path: '$users', includeArrayIndex: 'rank'}},
            {$match: {'users.telegramId': telegramId}},
            {$project: {rank: {$add: ['$rank', 1]}}},
        ]);

        return result[0]?.rank || 0;
    });
}
