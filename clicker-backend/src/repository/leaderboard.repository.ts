import {injectable} from 'inversify';
import {ILeaderboardRepository, LeaderboardEntry} from '../interfaces';
import {User} from '../models';
import {catchError} from '../errors';

@injectable()
export class LeaderboardRepository implements ILeaderboardRepository {
  getTopUsers = catchError(async (limit: number): Promise<LeaderboardEntry[]> => {
    const users = await User.find({isBanned: {$ne: true}})
      .sort({score: -1, _id: 1})
      .limit(limit)
      .lean();

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
    const me = await User.findOne({telegramId}).select({_id: 1, score: 1, isBanned: 1}).lean();
    if (!me || me.isBanned) return 0;

    const higherOrTieBefore = await User.countDocuments({
      isBanned: {$ne: true},
      $or: [{score: {$gt: me.score}}, {score: me.score, _id: {$lt: me._id}}],
    });

    return higherOrTieBefore + 1;
  });
}
