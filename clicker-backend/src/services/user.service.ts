import {inject, injectable} from 'inversify';
import {TYPES} from '../types/di.types';
import {IUserRepository, IUserService} from '../interfaces';
import {IUserDocument} from '../models';

@injectable()
export class UserService implements IUserService {
    constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {
    }

    async getUser(telegramId: string): Promise<IUserDocument | null> {
        return this.userRepository.findByTelegramId(telegramId);
    }

    async getOrCreateUser(
        telegramId: string,
        userData?: { username?: string; firstName?: string; lastName?: string }
    ): Promise<IUserDocument> {
        return this.userRepository.findOrCreateByTelegramId(telegramId, userData);
    }
}
