# Clicker Frontend

Telegram Mini App на Next.js 15 + React 19 для игры Crypto Bot Clicker.

## Установка

```bash
npm install
cp .env.example .env
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `NEXT_PUBLIC_API_URL` | URL бэкенд API | — |
| `NEXT_PUBLIC_DEV_INIT_DATA` | Тестовые initData для локальной разработки | — |
| `NEXT_PUBLIC_PLATFORM_LOCK` | Заблокировать запуск вне Telegram | `false` |
| `NEXT_PUBLIC_BOT_URL` | Ссылка на Telegram бота | — |

## Команды

```bash
# Разработка
npm run dev           # Запуск dev-сервера (Turbopack)

# Сборка и запуск
npm run build         # Production-сборка
npm run build:dev     # Сборка с моками (NEXT_PUBLIC_USE_MOCK=true)
npm run start         # Запуск production-сервера

# Линтинг
npm run lint          # Проверка Biome
npm run format        # Форматирование Biome
```

## Структура

```
src/
├── app/              # Next.js App Router
├── components/       # React-компоненты
├── hooks/            # Кастомные хуки
├── services/         # API-клиенты
├── stores/           # Zustand-сторы
├── types/            # TypeScript типы
└── utils/            # Утилиты
```

## Telegram Mini App

Приложение запускается внутри Telegram и использует [Telegram Web App API](https://core.telegram.org/bots/webapps).

Для локальной разработки установите `NEXT_PUBLIC_DEV_INIT_DATA` с валидными initData.
