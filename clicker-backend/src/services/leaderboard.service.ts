import {inject, injectable} from 'inversify';
import {TYPES} from '../types/di.types';
import {
  ILeaderboardRepository,
  ILeaderboardService,
  IUserRepository,
  LeaderboardEntry,
  LeaderboardResponse,
} from '../interfaces';
import {cacheGet, cacheSet} from '../utils';

@injectable()
export class LeaderboardService implements ILeaderboardService {
  constructor(
    @inject(TYPES.LeaderboardRepository) private leaderboardRepository: ILeaderboardRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}

  async getLeaderboard(telegramId: string): Promise<LeaderboardResponse> {
    const cacheKey = 'lb:top:25';
    let leaderboard = cacheGet(cacheKey) as LeaderboardEntry[] | undefined;

    if (!leaderboard) {
      leaderboard = await this.leaderboardRepository.getTopUsers(25);
      cacheSet(cacheKey, leaderboard, 5);
    }

    const [rank, user] = await Promise.all([
      this.leaderboardRepository.getUserRank(telegramId),
      this.userRepository.findByTelegramId(telegramId),
    ]);

    return {
      leaderboard,
      me: {
        rank,
        telegramId: user?.telegramId ?? telegramId,
        username: user?.username ?? null,
        firstName: user?.firstName ?? null,
        photoUrl: user?.photoUrl ?? null,
        score: user?.score ?? 0,
      },
    };
  }
}
