'use client';

import {useGameStore} from '@/store/game';
import {BanView} from './views/ban-view';

export function BanOverlay() {
  const isBanned = useGameStore(state => state.isBanned);

  if (!isBanned) return null;

  return <BanView />;
}
