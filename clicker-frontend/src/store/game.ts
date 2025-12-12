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
}

interface GameActions {
    init: (initData: string) => Promise<void>;
    click: (x: number, y: number) => void;
    syncClicks: () => Promise<void>;
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
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

export const useGameStore = create<GameStore>((set, get) => {
    const debouncedSyncClicks = debounce(() => void get().syncClicks(), SYNC_DELAY_MS, {
        maxWait: SYNC_DELAY_MS * 2
    });

    return {
        score: 0,
        isSyncing: false,
        isLoaded: false,
        clicksBuffer: [],
        metadata: {},
        initData: '',

        init: async (initData: string) => {
            set({initData, metadata: getMetadata()});

            try {
                const {score} = await api.getScore(initData);
                set({score, isLoaded: true});
            } catch {
                set({isLoaded: true});
            }
        },

        syncClicks: async () => {
            const {clicksBuffer, initData, isSyncing} = get();

            if (clicksBuffer.length === 0 || isSyncing) return;

            const clicksToSync = clicksBuffer.slice(0, MAX_BATCH_SIZE);
            const remaining = clicksBuffer.slice(MAX_BATCH_SIZE);

            set({clicksBuffer: remaining, isSyncing: true});

            try {
                const response = await api.submitClicks(clicksToSync, initData);
                const {clicksBuffer: pending} = get();
                set({score: response.score + pending.length, isSyncing: false});
            } catch {
                // Restore clicks on error
                const {clicksBuffer: pending} = get();
                set({clicksBuffer: [...clicksToSync, ...pending], isSyncing: false});
            }
        },

        click: (x: number, y: number) => {
            const {clicksBuffer, metadata, score} = get();

            const clickData: ClickData = {
                timestamp: new Date().toISOString(),
                x,
                y,
                metadata
            };

            const newBuffer = [...clicksBuffer, clickData];
            set({score: score + 1, clicksBuffer: newBuffer});

            if (newBuffer.length >= MAX_BATCH_SIZE) {
                debouncedSyncClicks.flush();
            } else {
                debouncedSyncClicks();
            }
        }
    };
});
