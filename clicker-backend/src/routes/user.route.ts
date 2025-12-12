import {FastifyInstance} from 'fastify';
import {container} from '../di-container';
import {TYPES} from '../types/di.types';
import {UserController} from '../controllers';
import {telegramAuthMiddleware} from '../middlewares';

export async function userRoutes(fastify: FastifyInstance) {
    const userController = container.get<UserController>(TYPES.UserController);

    fastify.addHook('preHandler', telegramAuthMiddleware);

    fastify.get('/me', userController.getMe.bind(userController));
    fastify.post('/clicks', userController.addClicks.bind(userController));
}
