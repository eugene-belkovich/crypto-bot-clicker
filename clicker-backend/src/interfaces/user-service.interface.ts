import {IUserDocument} from '../models';

export interface IUserService {
    getUser(telegramId: string): Promise<IUserDocument | null>;

    getOrCreateUser(telegramId: string, userData?: {username?: string; firstName?: string; lastName?: string}): Promise<IUserDocument>;
}
