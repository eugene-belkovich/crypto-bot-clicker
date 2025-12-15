import {Container} from 'inversify';
import {TYPES} from './types/di.types';
import {
  IUserRepository,
  IUserService,
  IClickRepository,
  IClickService,
  ILeaderboardRepository,
  ILeaderboardService,
} from './interfaces';
import {UserRepository, ClickRepository, LeaderboardRepository} from './repository';
import {UserService, ClickService, LeaderboardService} from './services';
import {HealthController, UserController, ClickController} from './controllers';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IClickRepository>(TYPES.ClickRepository).to(ClickRepository).inSingletonScope();
container.bind<ILeaderboardRepository>(TYPES.LeaderboardRepository).to(LeaderboardRepository).inSingletonScope();

// Services
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IClickService>(TYPES.ClickService).to(ClickService).inSingletonScope();
container.bind<ILeaderboardService>(TYPES.LeaderboardService).to(LeaderboardService).inSingletonScope();

// Controllers
container.bind<HealthController>(TYPES.HealthController).to(HealthController).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<ClickController>(TYPES.ClickController).to(ClickController).inSingletonScope();

export {container};
