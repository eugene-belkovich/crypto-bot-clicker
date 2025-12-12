import { Container } from 'inversify';
import { TYPES } from './types/di.types';

// Interfaces
import { IUserRepository, IUserService } from './interfaces';

// Repositories
import { UserRepository } from './repository';

// Services
import { UserService } from './services';

// Controllers
import { HealthController, UserController } from './controllers';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

// Services
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();

// Controllers
container.bind<HealthController>(TYPES.HealthController).to(HealthController).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();

export { container };
