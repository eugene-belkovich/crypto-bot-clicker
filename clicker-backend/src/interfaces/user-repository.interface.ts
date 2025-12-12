import {IUser, IUserDocument} from '../models';

export interface IUserRepository {
    findByTelegramId(telegramId: string): Promise<IUserDocument | null>;

    findOrCreateByTelegramId(telegramId: string, userData?: Partial<IUser>): Promise<IUserDocument>;

    incrementScore(telegramId: string, clicks: number): Promise<IUserDocument | null>;

    findById(id: string): Promise<IUserDocument | null>;
}
