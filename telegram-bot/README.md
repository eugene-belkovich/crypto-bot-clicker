# Telegram Bot

Telegram
бот
для
запуска
Mini
App
игры
Crypto
Bot
Clicker.

## Установка

```bash
npm install
cp .env.example .env
```

## Переменные окружения

| Переменная     | Описание                                               | По умолчанию |
| -------------- | ------------------------------------------------------ | ------------ |
| `BOT_TOKEN`    | Токен бота от @BotFather                               | —            |
| `MINI_APP_URL` | URL Telegram Mini App                                  | —            |
| `WEBHOOK_URL`  | URL вебхука для production                             | —            |
| `APP_PORT`     | Порт сервера                                           | `3001`       |
| `NODE_ENV`     | Окружение (`local`, `production`)                      | `local`      |
| `LOG_LEVEL`    | Уровень логирования (`debug`, `info`, `warn`, `error`) | `info`       |

## Команды

```bash
# Разработка
npm run dev           # Запуск с hot-reload (tsx watch)

# Сборка и запуск
npm run build         # Сборка TypeScript
npm run start         # Запуск production-сервера

# Docker
npm run docker:build  # Сборка Docker-образа
npm run docker:run    # Запуск контейнера

# Линтинг
npm run format        # Форматирование Prettier
npm run format:check  # Проверка форматирования
```

## Структура

```
src/
├── server.ts         # Точка входа
├── bot/              # Логика бота (grammy)
└── utils/            # Утилиты
```

## Режимы работы

-

* \*local
  \*\*:
  Long
  polling (
  не
  требует
  вебхук)

-

* \*development
  \*\*:
  Webhook
  через
  Express
