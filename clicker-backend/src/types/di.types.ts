export const TYPES = {
    // Repositories
    UserRepository: Symbol.for('UserRepository'),
    ClickRepository: Symbol.for('ClickRepository'),
    LeaderboardRepository: Symbol.for('LeaderboardRepository'),

    // Services
    UserService: Symbol.for('UserService'),
    ClickService: Symbol.for('ClickService'),
    LeaderboardService: Symbol.for('LeaderboardService'),

    // Controllers
    HealthController: Symbol.for('HealthController'),
    UserController: Symbol.for('UserController'),
    ClickController: Symbol.for('ClickController'),
};
