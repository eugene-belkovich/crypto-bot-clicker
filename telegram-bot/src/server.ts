import './logger';
import express from 'express';
import {Bot, GrammyError, HttpError} from 'grammy';
import {autoRetry} from '@grammyjs/auto-retry';
import {config} from './config';
import {handlers} from './handlers';
import {BOT_COMMANDS} from './commands';

const app = express();
app.use(express.json());

const bot = new Bot(config.botToken);

bot.api.config.use(
  autoRetry({
    maxRetryAttempts: 3,
    maxDelaySeconds: 300,
  }),
);

bot.use(async (ctx, next) => {
  const start = Date.now();

  const user = ctx.from;
  const userId = user?.id || 'unknown';
  const username = user?.username ? `@${user.username}` : user?.first_name || 'unknown';

  let action = 'unknown';
  if (ctx.message?.text) {
    action = ctx.message.text.startsWith('/')
      ? `command: ${ctx.message.text.split(' ')[0]}`
      : `message: "${ctx.message.text.slice(0, 50)}"`;
  } else if (ctx.callbackQuery?.data) {
    action = `callback: ${ctx.callbackQuery.data}`;
  } else if (ctx.inlineQuery?.query) {
    action = `inline: ${ctx.inlineQuery.query}`;
  }

  console.log(`[${userId}] ${username} -> ${action}`);

  await next();

  const ms = Date.now() - start;
  console.debug(`[${userId}] processed in ${ms}ms`);
});

bot.use(handlers);

bot.api.setMyCommands(BOT_COMMANDS);

// Set menu button to "Play" instead of hamburger menu
bot.api.setChatMenuButton({
  menu_button: {
    type: 'web_app',
    text: 'Play',
    web_app: {url: config.miniAppUrl},
  },
});

bot.catch(err => {
  const ctx = err.ctx;
  const chatIdDisplay = ctx.chat?.id ? `, chat id: ${ctx.chat.id}` : '';
  console.error(`[ERROR] Update ${ctx.update.update_id}${chatIdDisplay}:`);

  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Grammy error:', e.description);
  } else if (e instanceof HttpError) {
    console.error('HTTP error:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

app.get('/health-check', (_req, res) => {
  console.log('GET /health-check', 'OK');
  res.send('OK');
});

// Webhook endpoint for Telegram updates
app.post(`/webhook/${config.botToken}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.get('/version', (_req, res) => {
  const data = {
    name: 'crypto-clicker-bot',
    version: process.env.npm_package_version || '1.0.0',
  };
  console.log('GET /version', data);
  res.json(data);
});

async function startServer() {
  await bot.init();
  const botInfo = await bot.api.getMe();

  const server = app.listen(config.port, async () => {
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Express server listening on port ${config.port}`);

    if (config.webhookUrl) {
      // Production: use webhook
      const webhookPath = `/webhook/${config.botToken}`;
      const fullWebhookUrl = `${config.webhookUrl}${webhookPath}`;

      await bot.api.setWebhook(fullWebhookUrl);
      console.log(`Bot @${botInfo.username} is running with webhook!`);
      console.log(`Webhook URL: ${fullWebhookUrl}`);
    } else {
      // Development: use polling
      await bot.api.deleteWebhook();
      bot.start({
        onStart: () => {
          console.log(`Bot @${botInfo.username} is running with polling!`);
        },
      });
    }
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, graceful shutdown...');
    bot.stop();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000);
  });

  process.on('SIGINT', () => {
    console.log('\nStopping...');
    process.exit(0);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
