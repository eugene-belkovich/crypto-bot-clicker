import {FastifyInstance} from 'fastify';
import {container} from '../di-container';
import {HealthController} from '../controllers';
import {TYPES} from '../types/di.types';

export async function healthRoutes(fastify: FastifyInstance) {
  const healthController = container.get<HealthController>(TYPES.HealthController);

  fastify.get('/health-check', healthController.check.bind(healthController));
  fastify.get('/version', healthController.version.bind(healthController));
}
