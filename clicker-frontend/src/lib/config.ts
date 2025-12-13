import localConfig from '../../config/local.json';
import developmentConfig from '../../config/development.json';

type EnvironmentConfig = typeof localConfig;

const DEVELOPMENT_HOSTS = ['crypto-bot-clicker-frontend-dev.pages.dev'];

function isDevelopment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return DEVELOPMENT_HOSTS.includes(window.location.hostname);
}

function getConfig(): EnvironmentConfig {
  return isDevelopment() ? developmentConfig : localConfig;
}

export const config = {
  get apiUrl(): string {
    return getConfig().api.url;
  },
  get botUrl(): string {
    return getConfig().bot.url;
  },
  get platformLock(): boolean {
    return getConfig().platformLock;
  }
};
