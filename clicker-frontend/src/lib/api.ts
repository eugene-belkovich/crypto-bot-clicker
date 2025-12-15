import axios from 'axios';
import {useGameStore} from '@/store/game';
import type {ClickData, ClickResponse, LeaderboardData, UserData} from '@/types';
import {config} from './config';

let _apiClient: ReturnType<typeof axios.create> | null = null;

function getApiClient() {
  if (!_apiClient) {
    _apiClient = axios.create({
      baseURL: config.apiUrl,
      timeout: 5000,
    });

    _apiClient.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          const data = error.response.data;
          const isBanned = data?.banned || /ban|suspended/i.test(data?.message || data?.error || '');
          if (isBanned) {
            useGameStore.getState().setBanned();
          }
        }
        return Promise.reject(error);
      },
    );
  }
  return _apiClient;
}

export const api = {
  async submitClicks(clicks: ClickData[], initData: string): Promise<ClickResponse> {
    const response = await getApiClient().post<ClickResponse>('/api/clicks', clicks, {
      headers: {'X-Telegram-Init-Data': initData},
    });
    return response.data;
  },

  async getMe(initData: string): Promise<UserData> {
    const response = await getApiClient().get<UserData>('/api/me', {
      headers: {'X-Telegram-Init-Data': initData},
    });
    return response.data;
  },

  async getScore(initData: string): Promise<{score: number}> {
    const response = await getApiClient().get<{score: number}>('/api/score', {
      headers: {'X-Telegram-Init-Data': initData},
    });
    return response.data;
  },

  async getLeaderboard(initData: string): Promise<LeaderboardData> {
    const response = await getApiClient().get<LeaderboardData>('/api/leaderboard', {
      headers: {'X-Telegram-Init-Data': initData},
    });
    return response.data;
  },
};
