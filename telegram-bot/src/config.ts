import "dotenv/config";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
};

export const config = {
  botToken: requireEnv("BOT_TOKEN"),
  miniAppUrl: requireEnv("MINI_APP_URL"),
  port: parseInt(process.env.APP_PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  webhookUrl: process.env.WEBHOOK_URL,
};
