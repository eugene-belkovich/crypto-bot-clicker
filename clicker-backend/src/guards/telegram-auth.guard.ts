import {FastifyRequest} from 'fastify';
import {isInitDataValid, ParsedInitData, parseInitData} from '../utils';
import {container} from '../di-container';
import {IUserRepository} from '../interfaces';
import {TYPES} from '../types/di.types';
import {BannedError, UnauthorizedError} from '../errors';

declare module 'fastify' {
    interface FastifyRequest {
        telegramUser: ParsedInitData;
    }
}

export async function telegramAuthGuard(request: FastifyRequest) {
    const initData = request.headers['x-telegram-init-data'] as string;

    if (!initData || !isInitDataValid(initData)) {
        throw new UnauthorizedError();
    }

    const parsed = parseInitData(initData);
    if (!parsed) {
        throw new UnauthorizedError('Invalid init data');
    }

    // Check if user is banned
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
    const user = await userRepository.findByTelegramId(String(parsed.user.id));
    if (user?.isBanned) {
        throw new BannedError(user.banReason);
    }

    request.telegramUser = parsed;
}
