import {FastifyRequest} from 'fastify';
import {isInitDataValid, ParsedInitData, parseInitData} from '../utils';
import {container} from '../di-container';
import {IUserRepository} from '../interfaces';
import {TYPES} from '../types/di.types';
import {BannedError, UnauthorizedError} from '../errors';
import {config} from '../config';

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

  if (!config.telegram.skipValidation) {
    const nowSec = Math.floor(Date.now() / 1000);
    const maxAge = (config.telegram as any).maxAuthAgeSec ?? 86400; // default 24h
    if (nowSec - parsed.authDate > maxAge) {
      throw new UnauthorizedError('Auth data expired');
    }
  }

  // Check if user is banned
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  const user = await userRepository.findByTelegramId(String(parsed.user.id));
  if (user?.isBanned) {
    throw new BannedError(user.banReason);
  }

  request.telegramUser = parsed;
}
