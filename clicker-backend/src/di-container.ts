import {Container} from 'inversify';
import {TYPES} from './types/di.types';
import {IUserRepository, IUserService} from './interfaces';
import {UserRepository} from './repository';
import {UserService} from './services';
import {HealthController, UserController} from './controllers';

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<HealthController>(TYPES.HealthController).to(HealthController).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();

export {container};
