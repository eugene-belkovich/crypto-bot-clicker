'use client';

import {useTelegramContext} from '@/context/telegram-context';

export function useTelegram() {
  return useTelegramContext();
}
