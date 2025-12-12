"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { api } from "@/lib/api";
import type { GameState } from "@/types";

type GameAction =
  | { type: "CLICK" }
  | { type: "SYNC_START" }
  | { type: "SYNC_SUCCESS"; serverScore: number }
  | { type: "SYNC_ERROR"; clicksToRestore: number }
  | { type: "INIT"; score: number };

const initialState: GameState = {
  localScore: 0,
  serverScore: 0,
  pendingClicks: 0,
  isSyncing: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        localScore: action.score,
        serverScore: action.score,
      };
    case "CLICK":
      return {
        ...state,
        localScore: state.localScore + 1,
        pendingClicks: state.pendingClicks + 1,
      };
    case "SYNC_START":
      return {
        ...state,
        isSyncing: true,
      };
    case "SYNC_SUCCESS":
      return {
        ...state,
        serverScore: action.serverScore,
        localScore: action.serverScore + state.pendingClicks,
        isSyncing: false,
      };
    case "SYNC_ERROR":
      return {
        ...state,
        pendingClicks: state.pendingClicks + action.clicksToRestore,
        isSyncing: false,
      };
    default:
      return state;
  }
}

const SYNC_DELAY_MS = 300;

export function useGame(initData: string) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const clickBufferRef = useRef<number>(0);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  // Load initial score
  useEffect(() => {
    isMountedRef.current = true;

    api.getMe(initData).then((data) => {
      if (isMountedRef.current) {
        dispatch({ type: "INIT", score: data.score });
      }
    });

    return () => {
      isMountedRef.current = false;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [initData]);

  const syncClicks = useCallback(async () => {
    if (clickBufferRef.current === 0) return;

    const clicksToSync = clickBufferRef.current;
    clickBufferRef.current = 0;

    dispatch({ type: "SYNC_START" });

    try {
      const response = await api.submitClicks(clicksToSync, initData);
      if (isMountedRef.current) {
        dispatch({ type: "SYNC_SUCCESS", serverScore: response.score });
      }
    } catch {
      if (isMountedRef.current) {
        // Restore clicks to buffer for retry
        clickBufferRef.current += clicksToSync;
        dispatch({ type: "SYNC_ERROR", clicksToRestore: clicksToSync });
      }
    }
  }, [initData]);

  const handleClick = useCallback(() => {
    dispatch({ type: "CLICK" });
    clickBufferRef.current += 1;

    // Debounce: send batch after pause
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncClicks();
    }, SYNC_DELAY_MS);
  }, [syncClicks]);

  return {
    score: state.localScore,
    isSyncing: state.isSyncing,
    handleClick,
  };
}
