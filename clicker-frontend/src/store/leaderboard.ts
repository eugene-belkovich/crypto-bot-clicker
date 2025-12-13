import {create} from 'zustand';
import {api} from '@/lib/api';
import type {LeaderboardData} from '@/types';

const AUTO_REFRESH_INTERVAL_MS = 10000;

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
    const {initData: currentInitData, stopAutoRefresh} = get();

    if (currentInitData === initData) return;

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
    } catch {
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
  }
}));
