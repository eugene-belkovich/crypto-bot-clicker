import {inject, injectable} from 'inversify';
import {FastifyReply, FastifyRequest} from 'fastify';
import {TYPES} from '../types/di.types';
import {IClickService, IUserService} from '../interfaces';

@injectable()
export class UserController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ClickService) private clickService: IClickService
    ) {
    }

    async getMe(request: FastifyRequest, reply: FastifyReply) {
        const {user} = request.telegramUser;

        const dbUser = await this.userService.getOrCreateUser(String(user.id), {
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
        });

        const score = await this.clickService.getScore(String(user.id));

        return reply.send({
            user: {
                telegramId: dbUser.telegramId,
                username: dbUser.username,
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                createdAt: dbUser.createdAt,
                updatedAt: dbUser.updatedAt,
            },
            score,
        });
    }

    async getScore(request: FastifyRequest, reply: FastifyReply) {
        const {user} = request.telegramUser;

        const score = await this.clickService.getScore(String(user.id));

        return reply.send({score});
    }
}
