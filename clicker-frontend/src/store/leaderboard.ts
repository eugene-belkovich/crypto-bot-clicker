import axios, {AxiosError} from 'axios';
import {create} from 'zustand';
import {api} from '@/lib/api';
import type {LeaderboardData} from '@/types';
import {useGameStore} from './game';

const AUTO_REFRESH_INTERVAL_MS = 10000;

interface BannedResponse {
  banned: true;
  banReason?: string;
  error?: string;
}

function isBannedError(error: unknown): error is AxiosError<BannedResponse> {
  return axios.isAxiosError(error) && error.response?.status === 403 && error.response?.data?.banned === true;
}

interface LeaderboardState {
  data: LeaderboardData | null;
  isLoading: boolean;
  error: string | null;
  initData: string;
  intervalId: ReturnType<typeof setInterval> | null;
}

interface LeaderboardActions {
  init: (initData: string) => void;
  fetch: () => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  cleanup: () => void;
}

type LeaderboardStore = LeaderboardState & LeaderboardActions;

export const useLeaderboardStore = create<LeaderboardStore>((set, get) => ({
  data: null,
  isLoading: true,
  error: null,
  initData: '',
  intervalId: null,

  init: (initData: string) => {
    const {stopAutoRefresh} = get();

    stopAutoRefresh();
    set({initData, isLoading: true, error: null});

    void get().fetch();
    get().startAutoRefresh();
  },

  fetch: async () => {
    const {initData} = get();
    if (!initData) return;

    try {
      const result = await api.getLeaderboard(initData);
      set({data: result, error: null, isLoading: false});
    } catch (error) {
      if (isBannedError(error)) {
        const {banReason, error: errorMessage} = error.response!.data;
        useGameStore.setState({isBanned: true, banReason: banReason || errorMessage, isLoaded: true});
        set({error: 'Account suspended', isLoading: false});
        return;
      }
      set({error: 'Failed to load leaderboard', isLoading: false});
    }
  },

  startAutoRefresh: () => {
    const {intervalId} = get();
    if (intervalId) return;

    const id = setInterval(() => {
      void get().fetch();
    }, AUTO_REFRESH_INTERVAL_MS);

    set({intervalId: id});
  },

  stopAutoRefresh: () => {
    const {intervalId} = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({intervalId: null});
    }
  },

  cleanup: () => {
    get().stopAutoRefresh();
    set({data: null, isLoading: true, error: null, initData: ''});
  },
}));
