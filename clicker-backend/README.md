# Clicker Backend

REST API сервер на Fastify + MongoDB для игры Crypto Bot Clicker.

## Установка

```bash
npm install
cp .env.example .env
```

## Переменные окружения

| Переменная                 | Описание                                               | По умолчанию   |
| -------------------------- | ------------------------------------------------------ | -------------- |
| `PORT`                     | Порт сервера                                           | `8080`         |
| `HOST`                     | Хост сервера                                           | `0.0.0.0`      |
| `NODE_ENV`                 | Окружение (`local`, `production`)                      | `local`        |
| `TELEGRAM_BOT_TOKEN`       | Токен Telegram бота для валидации initData             | —              |
| `SKIP_TELEGRAM_VALIDATION` | Пропустить валидацию Telegram (для разработки)         | `false`        |
| `MONGODB_URI`              | URI подключения к MongoDB                              | —              |
| `ALLOWED_ORIGINS`          | Разрешённые origins для CORS (через запятую)           | —              |
| `LOG_LEVEL`                | Уровень логирования (`debug`, `info`, `warn`, `error`) | `info`         |
| `MIGRATE_MONGO_URI`        | URI MongoDB для миграций                               | —              |
| `MIGRATE_MONGO_COLLECTION` | Коллекция для хранения статуса миграций                | `migrations`   |
| `MIGRATE_MIGRATIONS_PATH`  | Путь к папке миграций                                  | `./migrations` |

## Команды

```bash
# Разработка
npm run dev           # Запуск dev-сервера с hot-reload
npm run debug         # Запуск с отладчиком (порт 9229)

# Сборка и запуск
npm run build         # Сборка TypeScript
npm run start         # Запуск production-сервера

# Тесты
npm run test          # Запуск тестов в watch-режиме
npm run test:run      # Однократный запуск тестов

# Миграции
npm run migration:create <name>   # Создать новую миграцию
npm run migration:up              # Применить миграции
npm run migration:down            # Откатить последнюю миграцию

# Сиды
npm run seed:top50    # Заполнить топ-50 тестовыми данными
npm run seed:reset    # Очистить все данные

# Линтинг
npm run lint          # Проверка ESLint
npm run lint:fix      # Автоисправление ESLint
npm run format        # Форматирование Prettier
```

## Структура

```
src/
├── server.ts         # Точка входа
├── routes/           # HTTP-роуты
├── services/         # Бизнес-логика
├── models/           # Mongoose-модели
├── utils/            # Утилиты
└── types/            # TypeScript типы
migrations/           # Файлы миграций
scripts/              # Скрипты (сиды и др.)
```
