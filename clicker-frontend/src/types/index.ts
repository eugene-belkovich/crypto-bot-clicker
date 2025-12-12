export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  photoUrl?: string;
  score: number;
}

export interface LeaderboardData {
  top25: LeaderboardEntry[];
  myRank: number;
  myScore: number;
}

export interface GameState {
  localScore: number;
  serverScore: number;
  pendingClicks: number;
  isSyncing: boolean;
}

export interface ClickResponse {
  score: number;
  rank: number;
}

export interface UserData {
  score: number;
  rank: number;
}
