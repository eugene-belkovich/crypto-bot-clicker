export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface ClickMetadata {
  userAgent?: string;
  hasTouchEvents?: boolean;
  hasOrientation?: boolean;
  hasOrientationEvent?: boolean;
  hasMotionEvent?: boolean;
  timeZone?: string;
}

export interface ClickData {
  timestamp: string;
  x: number;
  y: number;
  metadata?: ClickMetadata;
}

export interface ClickResponse {
  score: number;
}

export interface LeaderboardEntry {
  rank: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  photoUrl: string | null;
  score: number;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  me: LeaderboardEntry;
}

export interface UserData {
  user: {
    telegramId: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    createdAt: string;
    updatedAt: string;
  };
  score: number;
}
