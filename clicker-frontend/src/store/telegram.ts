import {create} from 'zustand';
import {
  getTelegramWebApp,
  isMobilePlatform,
  isTelegramWebApp,
  type TelegramPlatform,
  type TelegramThemeParams,
  type TelegramWebApp,
} from '@/lib/telegram';
import type {TelegramUser} from '@/types';

interface TelegramState {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  initData: string;
  isReady: boolean;
  themeParams: TelegramThemeParams;
  platform: TelegramPlatform;
  isMobile: boolean;
}

interface TelegramActions {
  init: () => void;
}

type TelegramStore = TelegramState & TelegramActions;

function applyTelegramTheme(themeParams: TelegramThemeParams) {
  if (typeof document === 'undefined') return;

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

export const useTelegramStore = create<TelegramStore>((set, get) => ({
  webApp: null,
  user: null,
  initData: '',
  isReady: false,
  themeParams: {},
  platform: 'unknown',
  isMobile: false,

  init: () => {
    const {isReady} = get();
    if (isReady) return;

    const webApp = getTelegramWebApp();
    const isRealTelegram = isTelegramWebApp();

    if (webApp && isRealTelegram) {
      webApp.ready();
      webApp.expand();
      applyTelegramTheme(webApp.themeParams);

      const platform = webApp.platform || 'unknown';

      set({
        webApp,
        user: webApp.initDataUnsafe.user || null,
        initData: webApp.initData,
        isReady: true,
        themeParams: webApp.themeParams,
        platform,
        isMobile: isMobilePlatform(platform),
      });
    } else {
      const devInitData = process.env.NEXT_PUBLIC_DEV_INIT_DATA || '';
      console.log('[Telegram] Dev mode, initData length:', devInitData.length);

      set({
        initData: devInitData,
        isReady: true,
        user: {
          id: 94986611,
          first_name: 'Eugene',
          username: 'ffrm4n',
        },
        platform: 'tdesktop',
        isMobile: false,
      });
    }
  },
}));
