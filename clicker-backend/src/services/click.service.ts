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
    ) {
    }

    async saveClicks(telegramId: string, clicks: ClickData[]): Promise<void> {
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

        // 3. Save clicks and increment score. Score uses $inc which is atomic, clicks are append-only logs
        const pointsPerClick = config.game.pointsPerClick;
        const scoreIncrement = clicks.length * pointsPerClick;

        await Promise.all([
            this.clickRepository.saveClicks(telegramId, clicks),
            this.userRepository.incrementScore(telegramId, scoreIncrement),
        ]);
    }
}
