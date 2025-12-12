import {injectable} from 'inversify';
import {IUserRepository} from '../interfaces';
import {IUser, IUserDocument, User} from '../models';
import {catchAsync} from '../utils';

@injectable()
export class UserRepository implements IUserRepository {
    findByTelegramId = catchAsync(async (telegramId: string): Promise<IUserDocument | null> => {
        return User.findOne({telegramId});
    });

    findOrCreateByTelegramId = catchAsync(
        async (telegramId: string, userData?: Partial<IUser>): Promise<IUserDocument> => {
            return User.findOneAndUpdate(
                {telegramId},
                {
                    $setOnInsert: {
                        telegramId,
                        username: userData?.username || null,
                        firstName: userData?.firstName || null,
                        lastName: userData?.lastName || null,
                        points: 0,
                        level: 1,
                    },
                },
                {upsert: true, new: true}
            );
        }
    );

    findById = catchAsync(async (id: string): Promise<IUserDocument | null> => {
        return User.findById(id);
    });
}
