import {injectable} from 'inversify';
import {FastifyReply, FastifyRequest} from 'fastify';
import {version, name} from '../../package.json';

@injectable()
export class HealthController {
    async check(_request: FastifyRequest, reply: FastifyReply) {
        return reply.send({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    }

    async version(_request: FastifyRequest, reply: FastifyReply) {
        return reply.send({
            name,
            version,
        });
    }
}
