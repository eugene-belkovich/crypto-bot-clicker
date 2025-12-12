import "dotenv/config";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
};

const nodeEnv = process.env.NODE_ENV || "local";
const isLocal = nodeEnv === "local";

export const config = {
  botToken: requireEnv("BOT_TOKEN"),
  miniAppUrl: requireEnv("MINI_APP_URL"),
  port: parseInt(process.env.APP_PORT || "3001", 10),
  nodeEnv,
  // Webhook only used on server (non-local mode)
  webhookUrl: isLocal ? undefined : process.env.WEBHOOK_URL,
};
