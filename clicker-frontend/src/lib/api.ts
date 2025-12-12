import axios from 'axios';
import type {ClickResponse, LeaderboardData, UserData} from '@/types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000
});

const MOCK_SCORE_KEY = 'clicker_mock_score';

function getMockScore(): number {
    if (typeof window === 'undefined') return 0;
    return Number.parseInt(localStorage.getItem(MOCK_SCORE_KEY) || '0', 10);
}

function setMockScore(score: number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MOCK_SCORE_KEY, score.toString());
}

function generateMockLeaderboard(myScore: number): LeaderboardData {
    const mockUsers = [
        {name: 'Alice', score: 14},
        {name: 'Bob', score: 13},
        {name: 'Charlie', score: 12},
        {name: 'David', score: 11},
        {name: 'Eve', score: 10},
        {name: 'Frank', score: 9},
        {name: 'Grace', score: 8},
        {name: 'Henry', score: 7},
        {name: 'Ivy', score: 6},
        {name: 'Jack', score: 5}
    ];

    const top25 = mockUsers.map((user, index) => ({
        rank: index + 1,
        oduserId: 1000 + index,
        name: user.name,
        score: user.score
    }));

    let myRank = 1;
    for (const user of mockUsers) {
        if (user.score > myScore) myRank++;
    }

    return {
        top25,
        myRank,
        myScore
    };
}

export const api = {
    async submitClicks(clicks: number, initData: string): Promise<ClickResponse> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 100));
            const currentScore = getMockScore();
            const newScore = currentScore + clicks;
            setMockScore(newScore);
            return {
                score: newScore,
                rank: Math.max(1, 11 - Math.floor(newScore / 100000))
            };
        }

        const response = await apiClient.post<ClickResponse>(
            '/api/clicks',
            {clicks},
            {headers: {'X-Telegram-Init-Data': initData}}
        );
        return response.data;
    },

    async getLeaderboard(initData: string): Promise<LeaderboardData> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return generateMockLeaderboard(getMockScore());
        }

        const response = await apiClient.get<LeaderboardData>('/api/leaderboard', {
            headers: {'X-Telegram-Init-Data': initData}
        });
        return response.data;
    },

    async getMe(initData: string): Promise<UserData> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 50));
            const score = getMockScore();
            return {
                score,
                rank: Math.max(1, 11 - Math.floor(score / 100000))
            };
        }

        const response = await apiClient.get<UserData>('/api/me', {
            headers: {'X-Telegram-Init-Data': initData}
        });
        return response.data;
    }
};
