import axios from "axios";
import type {ClickResponse, LeaderboardData, UserData} from "@/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

const MOCK_SCORE_KEY = "clicker_mock_score";

function getMockScore(): number {
    if (typeof window === "undefined") return 0;
    return Number.parseInt(localStorage.getItem(MOCK_SCORE_KEY) || "0", 10);
}

function setMockScore(score: number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(MOCK_SCORE_KEY, score.toString());
}

function generateMockLeaderboard(myScore: number): LeaderboardData {
    const mockUsers = [
        {name: "Alice", score: 999999},
        {name: "Bob", score: 888888},
        {name: "Charlie", score: 777777},
        {name: "David", score: 666666},
        {name: "Eve", score: 555555},
        {name: "Frank", score: 444444},
        {name: "Grace", score: 333333},
        {name: "Henry", score: 222222},
        {name: "Ivy", score: 111111},
        {name: "Jack", score: 99999},
    ];

    const top25 = mockUsers.map((user, index) => ({
        rank: index + 1,
        oduserId: 1000 + index,
        name: user.name,
        score: user.score,
    }));

    let myRank = 1;
    for (const user of mockUsers) {
        if (user.score > myScore) myRank++;
    }

    return {
        top25,
        myRank,
        myScore,
    };
}

export const api = {
    async submitClicks(clicks: number, initData: string): Promise<ClickResponse> {
        if (USE_MOCK) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const currentScore = getMockScore();
            const newScore = currentScore + clicks;
            setMockScore(newScore);
            return {
                score: newScore,
                rank: Math.max(1, 11 - Math.floor(newScore / 100000)),
            };
        }

        const response = await apiClient.post<ClickResponse>(
            "/api/clicks",
            {clicks},
            {headers: {"X-Telegram-Init-Data": initData}},
        );
        return response.data;
    },

    async getLeaderboard(initData: string): Promise<LeaderboardData> {
        if (USE_MOCK) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            return generateMockLeaderboard(getMockScore());
        }

        const response = await apiClient.get<LeaderboardData>("/api/leaderboard", {
            headers: {"X-Telegram-Init-Data": initData},
        });
        return response.data;
    },

    async getMe(initData: string): Promise<UserData> {
        if (USE_MOCK) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            const score = getMockScore();
            return {
                score,
                rank: Math.max(1, 11 - Math.floor(score / 100000)),
            };
        }

        const response = await apiClient.get<UserData>("/api/me", {
            headers: {"X-Telegram-Init-Data": initData},
        });
        return response.data;
    },
};
