'use client';

import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import {getTelegramWebApp, isTelegramWebApp, type TelegramThemeParams, type TelegramWebApp} from '@/lib/telegram';
import type {TelegramUser} from '@/types';

interface TelegramContextValue {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  initData: string;
  isReady: boolean;
  themeParams: TelegramThemeParams;
}

const TelegramContext = createContext<TelegramContextValue>({
  webApp: null,
  user: null,
  initData: '',
  isReady: false,
  themeParams: {}
});

export function useTelegramContext() {
  return useContext(TelegramContext);
}

function applyTelegramTheme(themeParams: TelegramThemeParams) {
  const root = document.documentElement;

  if (themeParams.bg_color) {
    root.style.setProperty('--tg-bg', themeParams.bg_color);
  }
  if (themeParams.text_color) {
    root.style.setProperty('--tg-text', themeParams.text_color);
  }
  if (themeParams.hint_color) {
    root.style.setProperty('--tg-hint', themeParams.hint_color);
  }
  if (themeParams.link_color) {
    root.style.setProperty('--tg-link', themeParams.link_color);
  }
  if (themeParams.button_color) {
    root.style.setProperty('--tg-button', themeParams.button_color);
  }
  if (themeParams.button_text_color) {
    root.style.setProperty('--tg-button-text', themeParams.button_text_color);
  }
  if (themeParams.secondary_bg_color) {
    root.style.setProperty('--tg-secondary-bg', themeParams.secondary_bg_color);
  }
}

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({children}: TelegramProviderProps) {
  const [state, setState] = useState<TelegramContextValue>({
    webApp: null,
    user: null,
    initData: '',
    isReady: false,
    themeParams: {}
  });

  useEffect(() => {
    const webApp = getTelegramWebApp();
    const isRealTelegram = isTelegramWebApp();

    if (webApp && isRealTelegram) {
      // Running inside real Telegram WebApp
      webApp.ready();
      webApp.expand();
      applyTelegramTheme(webApp.themeParams);

      setState({
        webApp,
        user: webApp.initDataUnsafe.user || null,
        initData: webApp.initData,
        isReady: true,
        themeParams: webApp.themeParams
      });
    } else {
      // Development mode - use dev initData from env
      const devInitData = process.env.NEXT_PUBLIC_DEV_INIT_DATA || '';
      console.log('[Telegram] Dev mode, initData length:', devInitData.length);
      setState(prev => ({
        ...prev,
        initData: devInitData,
        isReady: true,
        user: {
          id: 94986611,
          first_name: 'Eugene',
          username: 'ffrm4n'
        }
      }));
    }
  }, []);

  return <TelegramContext.Provider value={state}>{children}</TelegramContext.Provider>;
}
