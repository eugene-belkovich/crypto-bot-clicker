import axios from 'axios';
import {debounce} from 'lodash-es';
import {create} from 'zustand';
import {api} from '@/lib/api';
import type {ClickData, ClickMetadata} from '@/types';

const SYNC_DELAY_MS = 500;
const MAX_BATCH_SIZE = 50;

interface GameState {
  score: number;
  isSyncing: boolean;
  isLoaded: boolean;
  clicksBuffer: ClickData[];
  metadata: ClickMetadata;
  initData: string;
  isBanned: boolean;
  banReason?: string;
}

interface GameActions {
  init: (initData: string) => Promise<void>;
  click: (x: number, y: number) => void;
  syncClicks: () => Promise<void>;
  flushClicks: () => Promise<void>;
}

type GameStore = GameState & GameActions;

function getMetadata(): ClickMetadata {
  if (typeof window === 'undefined') return {};
  return {
    userAgent: navigator.userAgent,
    hasTouchEvents: 'ontouchstart' in window,
    hasOrientation: 'orientation' in window,
    hasOrientationEvent: 'DeviceOrientationEvent' in window,
    hasMotionEvent: 'DeviceMotionEvent' in window,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export const useGameStore = create<GameStore>((set, get) => {
  const debouncedSyncClicks = debounce(() => void get().syncClicks(), SYNC_DELAY_MS, {
    maxWait: SYNC_DELAY_MS * 2,
  });

  return {
    score: 0,
    isSyncing: false,
    isLoaded: false,
    clicksBuffer: [],
    metadata: {},
    initData: '',
    isBanned: false,
    banReason: undefined,

    init: async (initData: string) => {
      const {initData: currentInitData} = get();

      // Prevent re-initialization with same initData
      if (currentInitData === initData) return;

      set({initData, metadata: getMetadata()});

      try {
        const {score: serverScore} = await api.getScore(initData);
        // Account for any clicks made while fetching
        const {clicksBuffer} = get();
        set({score: serverScore + clicksBuffer.length, isLoaded: true});
      } catch (error) {
        // Check if banned
        if (axios.isAxiosError(error) && error.response?.status === 403 && error.response?.data?.banned) {
          set({
            isBanned: true,
            banReason: error.response.data.banReason || error.response.data.error,
            isLoaded: true,
          });
          return;
        }
        // On other errors, keep pending clicks as score
        const {clicksBuffer} = get();
        set({score: clicksBuffer.length, isLoaded: true});
      }
    },

    syncClicks: async () => {
      const {clicksBuffer, initData, isSyncing, isBanned} = get();

      if (clicksBuffer.length === 0 || isSyncing || isBanned) return;

      const clicksToSync = clicksBuffer.slice(0, MAX_BATCH_SIZE);
      const remaining = clicksBuffer.slice(MAX_BATCH_SIZE);

      set({clicksBuffer: remaining, isSyncing: true});

      try {
        const response = await api.submitClicks(clicksToSync, initData);
        const {clicksBuffer: pending} = get();
        set({score: response.score + pending.length, isSyncing: false});
      } catch (error) {
        // Check if banned (403 with banned flag)
        if (axios.isAxiosError(error) && error.response?.status === 403 && error.response?.data?.banned) {
          set({
            isBanned: true,
            banReason: error.response.data.banReason || error.response.data.error,
            isSyncing: false,
            clicksBuffer: [],
          });
          return;
        }
        // Restore clicks on other errors
        const {clicksBuffer: pending} = get();
        set({clicksBuffer: [...clicksToSync, ...pending], isSyncing: false});
      }
    },

    click: (x: number, y: number) => {
      const {clicksBuffer, metadata, score, isBanned} = get();

      // Don't register clicks if banned
      if (isBanned) return;

      const clickData: ClickData = {
        timestamp: new Date().toISOString(),
        x,
        y,
        metadata,
      };

      const newBuffer = [...clicksBuffer, clickData];
      set({score: score + 1, clicksBuffer: newBuffer});

      if (newBuffer.length >= MAX_BATCH_SIZE) {
        debouncedSyncClicks.flush();
      } else {
        debouncedSyncClicks();
      }
    },

    flushClicks: async () => {
      debouncedSyncClicks.cancel();
      const {clicksBuffer} = get();
      if (clicksBuffer.length > 0) {
        await get().syncClicks();
      }
    },
  };
});
