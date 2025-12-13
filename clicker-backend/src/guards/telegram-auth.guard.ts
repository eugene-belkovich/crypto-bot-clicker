import {FastifyReply, FastifyRequest} from 'fastify';
import {isInitDataValid, ParsedInitData, parseInitData} from '../utils';

declare module 'fastify' {
    interface FastifyRequest {
        telegramUser: ParsedInitData;
    }
}

export async function telegramAuthGuard(request: FastifyRequest, reply: FastifyReply) {
    const initData = request.headers['x-telegram-init-data'] as string;

    if (!initData || !isInitDataValid(initData)) {
        return reply.status(401).send({error: 'Unauthorized'});
    }

    const parsed = parseInitData(initData);
    if (!parsed) {
        return reply.status(401).send({error: 'Invalid init data'});
    }

    request.telegramUser = parsed;
}
