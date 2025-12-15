export interface LeaderboardEntry {
  rank: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  photoUrl: string | null;
  score: number;
}

export interface ILeaderboardRepository {
  getTopUsers(limit: number): Promise<LeaderboardEntry[]>;

  getUserRank(telegramId: string): Promise<number>;
}
