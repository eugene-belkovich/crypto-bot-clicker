import {IClickDocument} from '../models';
import {ClickData} from './click-repository.interface';

export interface IClickService {
    saveClicks(userId: string, clicks: ClickData[]): Promise<IClickDocument[]>;

    getScore(userId: string): Promise<number>;
}
