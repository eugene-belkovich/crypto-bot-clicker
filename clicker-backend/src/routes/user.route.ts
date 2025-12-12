import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {container} from '../di-container';
import {TYPES} from '../types/di.types';
import {IUserService} from '../interfaces';
import {parseInitData} from '../utils';

export async function userRoutes(fastify: FastifyInstance) {
    const userService = container.get<IUserService>(TYPES.UserService);

    fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
        const initData = request.headers['x-telegram-init-data'] as string;
        const parsed = parseInitData(initData);

        if (!parsed) {
            return reply.status(401).send({error: 'Invalid init data'});
        }

        const user = await userService.getOrCreateUser(String(parsed.user.id), {
            username: parsed.user.username,
            firstName: parsed.user.first_name,
            lastName: parsed.user.last_name,
        });

        return reply.send({score: user.score, rank: 1});
    });

    fastify.post('/clicks', async (request: FastifyRequest<{Body: {clicks: number}}>, reply: FastifyReply) => {
        const initData = request.headers['x-telegram-init-data'] as string;
        const parsed = parseInitData(initData);

        if (!parsed) {
            return reply.status(401).send({error: 'Invalid init data'});
        }

        const {clicks} = request.body;
        if (typeof clicks !== 'number' || clicks <= 0) {
            return reply.status(400).send({error: 'Invalid clicks'});
        }

        const user = await userService.incrementScore(String(parsed.user.id), clicks);
        if (!user) {
            return reply.status(404).send({error: 'User not found'});
        }

        return reply.send({score: user.score, rank: 1});
    });
}
