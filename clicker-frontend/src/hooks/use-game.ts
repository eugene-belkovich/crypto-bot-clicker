"use client";

import {useCallback, useEffect, useReducer, useRef} from "react";
import type {GameState} from "@/types";

type GameAction =
    | { type: "CLICK" }
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
        default:
            return state;
    }
}

export function useGame(initData: string) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const clickBufferRef = useRef<number>(0);
    const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(true);

    // Load initial score
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        };
    }, [initData]);


    const handleClick = useCallback(() => {
        dispatch({type: "CLICK"});
        clickBufferRef.current += 1;

        // Debounce: send batch after pause
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }

    }, []);

    return {
        score: state.localScore,
        isSyncing: state.isSyncing,
        handleClick,
    };
}
