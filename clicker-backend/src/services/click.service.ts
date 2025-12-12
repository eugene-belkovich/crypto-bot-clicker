import {inject, injectable} from 'inversify';
import {TYPES} from '../types/di.types';
import {ClickData, IClickRepository, IClickService} from '../interfaces';
import {IClickDocument} from '../models';

@injectable()
export class ClickService implements IClickService {
    constructor(@inject(TYPES.ClickRepository) private clickRepository: IClickRepository) {
    }

    async saveClicks(userId: string, clicks: ClickData[]): Promise<IClickDocument[]> {
        return this.clickRepository.saveClicks(userId, clicks);
    }

    async getScore(userId: string): Promise<number> {
        return this.clickRepository.getScoreByUserId(userId);
    }
}
