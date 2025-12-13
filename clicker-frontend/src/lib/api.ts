import axios from 'axios';
import type {ClickData, ClickResponse, LeaderboardData, UserData} from '@/types';
import {config} from './config';

// Lazy-initialized axios instance to ensure config.apiUrl is available at runtime
let _apiClient: ReturnType<typeof axios.create> | null = null;

function getApiClient() {
  if (!_apiClient) {
    _apiClient = axios.create({
      baseURL: config.apiUrl,
      timeout: 5000
    });
  }
  return _apiClient;
}

export const api = {
  async submitClicks(clicks: ClickData[], initData: string): Promise<ClickResponse> {
    const response = await getApiClient().post<ClickResponse>('/api/clicks', clicks, {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  },

  async getMe(initData: string): Promise<UserData> {
    const response = await getApiClient().get<UserData>('/api/me', {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  },

  async getScore(initData: string): Promise<{score: number}> {
    const response = await getApiClient().get<{score: number}>('/api/score', {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  },

  async getLeaderboard(initData: string): Promise<LeaderboardData> {
    const response = await getApiClient().get<LeaderboardData>('/api/leaderboard', {
      headers: {'X-Telegram-Init-Data': initData}
    });
    return response.data;
  }
};
