export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
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

