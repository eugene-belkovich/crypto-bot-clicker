import {injectable} from 'inversify';
import {ClientSession} from 'mongoose';
import {IUserRepository} from '../interfaces';
import {IUser, IUserDocument, User} from '../models';
import {catchError} from '../errors';

@injectable()
export class UserRepository implements IUserRepository {
    findByTelegramId = catchError(async (telegramId: string): Promise<IUserDocument | null> => {
        return User.findOne({telegramId});
    });

    findOrCreateByTelegramId = catchError(
        async (telegramId: string, userData?: Partial<IUser>): Promise<IUserDocument> => {
            return User.findOneAndUpdate(
                {telegramId},
                {
                    $setOnInsert: {
                        telegramId,
                        username: userData?.username || null,
                        firstName: userData?.firstName || null,
                        lastName: userData?.lastName || null,
                    },
                },
                {upsert: true, new: true}
            );
        }
    );

    findById = catchError(async (id: string): Promise<IUserDocument | null> => {
        return User.findById(id);
    });

    incrementScore = catchError(
        async (telegramId: string, amount: number, session?: ClientSession): Promise<IUserDocument | null> => {
            return User.findOneAndUpdate(
                {telegramId},
                {
                    $inc: {score: amount},
                    $setOnInsert: {telegramId}
                },
                {new: true, upsert: true, session}
            );
        }
    );
}
