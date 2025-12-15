# Crypto Bot Clicker

Ссылка на игру: https://t.me/CryptoBotClickerBot

Ссылка на обзор: https://www.loom.com/share/a7ff92b59c67483c9b656b3dedd99fef

Telegram Mini App — кликер-игра с криптовалютной тематикой.

## Архитектура

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Telegram Bot  │     │    Frontend     │     │    Backend      │
│    (grammy)     │     │   (Next.js)     │     │   (Fastify)     │
│                 │     │                 │     │                 │
│  AWS App Runner │     │ Cloudflare CDN  │     │ AWS App Runner  │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       └───────────────────────┤
         │                                               │
         │                                      ┌────────┴────────┐
         │                                      │    MongoDB      │
         │                                      │  (Atlas / EC2)  │
         └──────────────────────────────────────┴─────────────────┘
```

## Подпроекты

| Проект                                 | Описание                      | Документация                           |
|----------------------------------------|-------------------------------|----------------------------------------|
| [clicker-backend](./clicker-backend)   | REST API на Fastify + MongoDB | [README](./clicker-backend/README.md)  |
| [clicker-frontend](./clicker-frontend) | Telegram Mini App на Next.js  | [README](./clicker-frontend/README.md) |
| [telegram-bot](./telegram-bot)         | Telegram бот на grammy        | [README](./telegram-bot/README.md)     |

## Инфраструктура

| Компонент          | Сервис           | Регион     |
|--------------------|------------------|------------|
| Frontend           | Cloudflare Pages | Global CDN |
| Backend            | AWS App Runner   | US         |
| Telegram Bot       | AWS App Runner   | US         |
| Container Registry | AWS ECR          | US         |
| Database           | MongoDB Atlas    | US         |
| Monitoring         | Better Uptime    | —          |

## CI/CD

Деплой осуществляется автоматически через **GitHub Actions** при push в `main`.

Каждый подпроект деплоится **независимо и параллельно** — триггер срабатывает только при изменениях в соответствующей папке:

| Проект                | Триггер                  | Pipeline   |
|-----------------------|--------------------------|------------|
| `clicker-backend/**`  | Build → ECR → App Runner | Blue/Green |
| `clicker-frontend/**` | Build → Cloudflare Pages | Instant    |
| `telegram-bot/**`     | Build → ECR → App Runner | Blue/Green |

### Стратегия деплоя

- **Backend / Bot**: Blue/Green deployment через App Runner — новая версия запускается параллельно, трафик переключается после health check
- **Frontend**: Мгновенный деплой на Cloudflare CDN с автоматической инвалидацией кэша

### Workflows

```
.github/workflows/
├── clicker-backend.dev.yaml    # Backend CI/CD
├── clicker-frontend.dev.yml    # Frontend CI/CD
└── telegram-bot.dev.yaml       # Bot CI/CD
```

## Быстрый старт

```bash
# Клонирование
git clone <repo-url>
cd crypto-bot-clicker

# Установка зависимостей (для каждого подпроекта)
cd clicker-backend && npm install && cd ..
cd clicker-frontend && npm install && cd ..
cd telegram-bot && npm install && cd ..

# Настройка окружения
cp clicker-backend/.env.example clicker-backend/.env
cp clicker-frontend/.env.example clicker-frontend/.env
cp telegram-bot/.env.example telegram-bot/.env

# Запуск (в разных терминалах)
cd clicker-backend && npm run dev
cd clicker-frontend && npm run dev
cd telegram-bot && npm run dev
```

## Требования

- Node.js 20+
- MongoDB 7+
- Docker (для локальной сборки образов)
