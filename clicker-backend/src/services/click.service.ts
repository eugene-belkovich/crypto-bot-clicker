import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';
import {TYPES} from '../types/di.types';
import {ClickData, IClickRepository, IClickService, IUserRepository} from '../interfaces';

@injectable()
export class ClickService implements IClickService {
    constructor(
        @inject(TYPES.ClickRepository) private clickRepository: IClickRepository,
        @inject(TYPES.UserRepository) private userRepository: IUserRepository
    ) {
    }

    async saveClicks(telegramId: string, clicks: ClickData[]): Promise<void> {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            await this.clickRepository.saveClicks(telegramId, clicks, session);
            await this.userRepository.incrementScore(telegramId, clicks.length, session);

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
