import {FastifyInstance} from 'fastify';
import {container} from '../di-container';
import {UserController} from '../controllers';
import {TYPES} from '../types/di.types';

export async function userRoutes(fastify: FastifyInstance) {
    const userController = container.get<UserController>(TYPES.UserController);

    fastify.get('/:telegramId', userController.getUser.bind(userController));

    fastify.post('/', userController.createOrGetUser.bind(userController));
}
