"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {api} from "@/lib/api";
import type {LeaderboardData} from "@/types";

const AUTO_REFRESH_INTERVAL_MS = 10000;

export function useLeaderboard(initData: string) {
    const [data, setData] = useState<LeaderboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useRef(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        try {
            const result = await api.getLeaderboard(initData);
            if (isMountedRef.current) {
                setData(result);
                setError(null);
            }
        } catch {
            if (isMountedRef.current) {
                setError("Failed to load leaderboard");
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [initData]);

    useEffect(() => {
        isMountedRef.current = true;

        fetchLeaderboard();

        intervalRef.current = setInterval(() => {
            fetchLeaderboard();
        }, AUTO_REFRESH_INTERVAL_MS);

        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchLeaderboard]);

    return {
        data,
        isLoading,
        error,
        refresh: fetchLeaderboard,
    };
}
