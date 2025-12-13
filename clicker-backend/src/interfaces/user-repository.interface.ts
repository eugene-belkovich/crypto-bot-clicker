import {ClientSession} from 'mongoose';
import {IUser, IUserDocument} from '../models';

export interface IUserRepository {
    findByTelegramId(telegramId: string): Promise<IUserDocument | null>;

    findOrCreateByTelegramId(telegramId: string, userData?: Partial<IUser>): Promise<IUserDocument>;

    findById(id: string): Promise<IUserDocument | null>;

    incrementScore(telegramId: string, amount: number, session?: ClientSession): Promise<IUserDocument | null>;

    banUser(telegramId: string, reason: string): Promise<IUserDocument | null>;
}
