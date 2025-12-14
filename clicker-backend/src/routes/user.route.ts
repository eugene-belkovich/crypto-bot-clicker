import {FastifyInstance} from 'fastify';
import {container} from '../di-container';
import {TYPES} from '../types/di.types';
import {UserController} from '../controllers';
import {telegramAuthGuard} from '../guards';
import {getMeSchema, getScoreSchema, getLeaderboardSchema} from '../schemas';

export async function userRoutes(fastify: FastifyInstance) {
    const userController = container.get<UserController>(TYPES.UserController);

    fastify.addHook('preHandler', telegramAuthGuard);

    fastify.get('/me', {schema: getMeSchema}, userController.getMe.bind(userController));
    fastify.get('/score', {schema: getScoreSchema}, userController.getScore.bind(userController));
    fastify.get('/leaderboard', {schema: getLeaderboardSchema}, userController.getLeaderboard.bind(userController));
}
