import {LeaderboardEntry} from './leaderboard-repository.interface';

export interface LeaderboardResponse {
    leaderboard: LeaderboardEntry[];
    me: LeaderboardEntry;
}

export interface ILeaderboardService {
    getLeaderboard(telegramId: string): Promise<LeaderboardResponse>;
}
