import {inject, injectable} from 'inversify';
import {FastifyReply, FastifyRequest} from 'fastify';
import {TYPES} from '../types/di.types';
import {ILeaderboardService, IUserService} from '../interfaces';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.LeaderboardService) private leaderboardService: ILeaderboardService,
  ) {}

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const {user} = request.telegramUser;

    const dbUser = await this.userService.getOrCreateUser(String(user.id), {
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      photoUrl: user.photo_url,
    });

    return reply.send({
      user: {
        telegramId: dbUser.telegramId,
        username: dbUser.username,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
      score: dbUser.score,
    });
  }

  async getScore(request: FastifyRequest, reply: FastifyReply) {
    const {user} = request.telegramUser;

    const dbUser = await this.userService.getOrCreateUser(String(user.id), {
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      photoUrl: user.photo_url,
    });

    return reply.send({score: dbUser.score});
  }

  async getLeaderboard(request: FastifyRequest, reply: FastifyReply) {
    const {user} = request.telegramUser;

    const leaderboard = await this.leaderboardService.getLeaderboard(String(user.id));

    return reply.send(leaderboard);
  }
}
