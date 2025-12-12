import axios from 'axios';
import type {ClickData, ClickResponse, LeaderboardData, UserData} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

export const api = {
  async submitClicks(clicks: ClickData[], initData: string): Promise<ClickResponse> {
    const response = await apiClient.post<ClickResponse>('/api/clicks', clicks, {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  },

  async getMe(initData: string): Promise<UserData> {
    const response = await apiClient.get<UserData>('/api/me', {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  },

  async getScore(initData: string): Promise<{score: number}> {
    const response = await apiClient.get<{score: number}>('/api/score', {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  },

  async getLeaderboard(initData: string): Promise<LeaderboardData> {
    const response = await apiClient.get<LeaderboardData>('/api/leaderboard', {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  }
};
