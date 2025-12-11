# Crypto Clicker Bot

Telegram bot for Crypto Clicker mini-app game.

## Setup

```bash
cp .env.example .env
npm install
```

## Run

```bash
npm run dev      # Development with hot-reload
npm start        # Production
```

## Docker

```bash
npm run docker:build
npm run docker:run
```

## Environment

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `BOT_TOKEN`    | Telegram bot token from @BotFather                  |
| `MINI_APP_URL` | URL of your Telegram Mini App                       |
| `APP_PORT`     | Server port (default: 3000)                         |
| `NODE_ENV`     | Environment: development / production               |
| `LOG_LEVEL`    | Log level: debug, info, warn, error (default: info) |
