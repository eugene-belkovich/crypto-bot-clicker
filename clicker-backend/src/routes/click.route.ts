import {FastifyInstance} from 'fastify';
import {container} from '../di-container';
import {TYPES} from '../types/di.types';
import {ClickController} from '../controllers';
import {telegramAuthGuard} from '../guards';

export async function clickRoutes(fastify: FastifyInstance) {
    const clickController = container.get<ClickController>(TYPES.ClickController);

    fastify.addHook('preHandler', telegramAuthGuard);

    fastify.post('/', clickController.saveClicks.bind(clickController));
}
