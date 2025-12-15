import {FastifyInstance} from 'fastify';
import {container} from '../di-container';
import {TYPES} from '../types/di.types';
import {ClickController} from '../controllers';
import {telegramAuthGuard} from '../guards';
import {saveClicksSchema} from '../schemas';

export async function clickRoutes(fastify: FastifyInstance) {
  const clickController = container.get<ClickController>(TYPES.ClickController);

  fastify.addHook('preHandler', telegramAuthGuard);

  fastify.post('/', {schema: saveClicksSchema}, clickController.saveClicks.bind(clickController));
}
