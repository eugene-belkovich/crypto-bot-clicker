import {inject, injectable} from 'inversify';
import {TYPES} from '../types/di.types';
import {ILeaderboardRepository, ILeaderboardService, IUserRepository, LeaderboardResponse} from '../interfaces';

@injectable()
export class LeaderboardService implements ILeaderboardService {
  constructor(
    @inject(TYPES.LeaderboardRepository) private leaderboardRepository: ILeaderboardRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}

  async getLeaderboard(telegramId: string): Promise<LeaderboardResponse> {
    const [leaderboard, rank, user] = await Promise.all([
      this.leaderboardRepository.getTopUsers(25),
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
