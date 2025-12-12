import {FastifyInstance} from 'fastify';
import {healthRoutes} from './health.route';
import {userRoutes} from './user.route';

export async function registerRoutes(fastify: FastifyInstance) {
    await fastify.register(healthRoutes);
    await fastify.register(userRoutes, {prefix: '/api'});
}
