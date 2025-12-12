'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {api} from '@/lib/api';

const SYNC_DELAY_MS = 300;

export function useGame(initData: string) {
  const [score, setScore] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const clickBufferRef = useRef<number>(0);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const baseScoreRef = useRef<number>(0); // Server-confirmed score

  useEffect(() => {
    isMountedRef.current = true;

    api.getMe(initData).then(data => {
      if (isMountedRef.current) {
        setScore(data.score);
        baseScoreRef.current = data.score;
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

    setIsSyncing(true);

    try {
      const response = await api.submitClicks(clicksToSync, initData);
      if (isMountedRef.current) {
        baseScoreRef.current = response.score;
        setScore(response.score + clickBufferRef.current);
      }
    } catch {
      if (isMountedRef.current) {
        clickBufferRef.current += clicksToSync;
      }
    } finally {
      if (isMountedRef.current) {
        setIsSyncing(false);
        if (clickBufferRef.current > 0) {
          syncTimeoutRef.current = setTimeout(() => {
            syncClicks();
          }, SYNC_DELAY_MS);
        }
      }
    }
  }, [initData]);

  const handleClick = useCallback(() => {
    setScore(prev => prev + 1);
    clickBufferRef.current += 1;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncClicks();
    }, SYNC_DELAY_MS);
  }, [syncClicks]);

  return {
    score,
    isSyncing,
    handleClick
  };
}
