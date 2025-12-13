import type {TelegramUser} from '@/types';

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

export type TelegramPlatform = 'ios' | 'android' | 'android_x' | 'tdesktop' | 'macos' | 'weba' | 'webk' | 'unigram' | 'unknown';

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  platform: TelegramPlatform;
  ready: () => void;
  expand: () => void;
  close: () => void;
  themeParams: TelegramThemeParams;
  colorScheme: 'light' | 'dark';
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
}

export function isMobilePlatform(platform: TelegramPlatform): boolean {
  return platform === 'ios' || platform === 'android' || platform === 'android_x';
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

export function isTelegramWebApp(): boolean {
  const webApp = getTelegramWebApp();
  return webApp !== null && webApp.initData !== '';
}
