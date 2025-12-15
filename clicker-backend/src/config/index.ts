import localConfig from '../../config/local.json';
import developmentConfig from '../../config/development.json';

export type AppConfig = typeof localConfig;

const isLocal = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development';

function loadConfig(): AppConfig {
  // NODE_ENV=development or NODE_ENV=production on AWS -> use development.json
  // NODE_ENV=undefined or other (local dev) -> use local.json
  return isLocal ? localConfig : developmentConfig;
}

export const config = loadConfig();

// Re-export mongoose utility
export * from '../utils/mongoose';
