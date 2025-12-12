import { IUser, IUserDocument } from '../models';

export interface IUserRepository {
  findByTelegramId(telegramId: string): Promise<IUserDocument | null>;
  findOrCreateByTelegramId(telegramId: string, userData?: Partial<IUser>): Promise<IUserDocument>;
  updatePoints(telegramId: string, points: number): Promise<IUserDocument | null>;
  incrementPoints(telegramId: string, amount: number): Promise<IUserDocument | null>;
  getLeaderboard(limit: number): Promise<IUserDocument[]>;
  findById(id: string): Promise<IUserDocument | null>;
}
