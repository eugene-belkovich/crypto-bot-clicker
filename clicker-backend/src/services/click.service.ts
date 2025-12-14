import {inject, injectable} from 'inversify';
import {TYPES} from '../types/di.types';
import {ClickData, IClickRepository, IClickService, IUserRepository} from '../interfaces';
import {validateClickBatch} from '../utils';
import {BannedError} from '../errors';
import {config} from '../config';

@injectable()
export class ClickService implements IClickService {
    constructor(
        @inject(TYPES.ClickRepository) private clickRepository: IClickRepository,
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {}

    async saveClicks(telegramId: string, clicks: ClickData[]): Promise<number> {
        // 1. Check if user is banned
        const user = await this.userRepository.findByTelegramId(telegramId);
        if (user?.isBanned) {
            throw new BannedError('Account suspended');
        }

        // 2. Anti-cheat validation
        const validation = validateClickBatch(clicks);
        if (validation.suspicious) {
            await this.userRepository.banUser(telegramId, validation.reason);
            throw new BannedError(validation.reason);
        }

        // 3. Upsert clicks and increment score only by newly inserted items
        const savedCount = await this.clickRepository.saveClicks(telegramId, clicks);
        if (savedCount > 0) {
            const savedPoints = savedCount * (config.game.pointsPerClick ?? 1);
            const user = await this.userRepository.incrementScore(telegramId, savedPoints);
            return user?.score ?? (user?.score ?? 0) + savedPoints;
        }

        // No new clicks inserted → return current score
        const fresh = await this.userRepository.findByTelegramId(telegramId);
        return fresh?.score ?? 0;
    }
}
