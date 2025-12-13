import {FastifyInstance} from 'fastify';
import {container} from '../di-container';
import {TYPES} from '../types/di.types';
import {UserController} from '../controllers';
import {telegramAuthGuard} from '../guards';

export async function userRoutes(fastify: FastifyInstance) {
    const userController = container.get<UserController>(TYPES.UserController);

    fastify.addHook('preHandler', telegramAuthGuard);

    fastify.get('/me', userController.getMe.bind(userController));
    fastify.get('/score', userController.getScore.bind(userController));
    fastify.get('/leaderboard', userController.getLeaderboard.bind(userController));
}
