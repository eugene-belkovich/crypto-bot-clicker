import {inject, injectable} from 'inversify';
import {FastifyReply, FastifyRequest} from 'fastify';
import {TYPES} from '../types/di.types';
import {IUserService} from '../interfaces';

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: IUserService) {
    }

    async getMe(request: FastifyRequest, reply: FastifyReply) {
        const {user} = request.telegramUser;

        const dbUser = await this.userService.getOrCreateUser(String(user.id), {
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
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
            score: dbUser.score
        });
    }

    async addClicks(request: FastifyRequest<{ Body: { clicks: number } }>, reply: FastifyReply) {
        const {user} = request.telegramUser;
        const {clicks} = request.body;

        if (typeof clicks !== 'number' || clicks <= 0) {
            return reply.status(400).send({error: 'Invalid clicks'});
        }

        const dbUser = await this.userService.incrementScore(String(user.id), clicks);
        if (!dbUser) {
            return reply.status(404).send({error: 'User not found'});
        }

        return reply.send({score: dbUser.score, rank: 1});
    }
}
