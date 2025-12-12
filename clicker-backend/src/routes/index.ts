import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.route';
import { userRoutes } from './user.route';

export async function registerRoutes(fastify: FastifyInstance) {
  // Health routes (no prefix)
  await fastify.register(healthRoutes);

  // API v1 routes
  await fastify.register(
    async (api) => {
      await api.register(userRoutes, { prefix: '/users' });
    },
    { prefix: '/api/v1' }
  );
}
