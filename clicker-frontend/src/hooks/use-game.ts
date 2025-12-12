'use client';

import {useEffect} from 'react';
import {useGameStore} from '@/store/game';

export function useGame(initData: string) {
  const score = useGameStore(state => state.score);
  const isSyncing = useGameStore(state => state.isSyncing);
  const isLoaded = useGameStore(state => state.isLoaded);
  const init = useGameStore(state => state.init);
  const click = useGameStore(state => state.click);

  useEffect(() => {
    if (initData) {
      init(initData);
    }
  }, [init, initData]);

  return {
    score,
    isSyncing,
    isLoaded,
    handleClick: click
  };
}
