'use client';

import {useEffect} from 'react';
import {useTelegramStore} from '@/store/telegram';

export function useTelegram() {
  const store = useTelegramStore();

  useEffect(() => {
    store.init();
  }, [store.init]);

  return store;
}
