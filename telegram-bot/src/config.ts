import 'dotenv/config';
import localConfig from '../config/local.json';
import developmentConfig from '../config/development.json';

type AppConfig = typeof localConfig;

const nodeEnv = process.env.NODE_ENV || 'local';
const isLocal = nodeEnv === 'local';

function loadConfig(): AppConfig {
  return isLocal ? localConfig : developmentConfig;
}

const jsonConfig = loadConfig();

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
};

export const config = {
  botToken: requireEnv('BOT_TOKEN'),
  miniAppUrl: jsonConfig.miniApp.url,
  port: jsonConfig.app.port,
  nodeEnv,
  webhookUrl: jsonConfig.webhook.url || undefined,
  logging: jsonConfig.logging,
};
