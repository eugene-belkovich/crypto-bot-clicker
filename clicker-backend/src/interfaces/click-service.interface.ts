import {ClickData} from './click-repository.interface';

export interface IClickService {
  saveClicks(telegramId: string, clicks: ClickData[]): Promise<number>;
}
