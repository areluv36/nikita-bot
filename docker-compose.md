# Docker Compose для Nikita Bot

## Быстрый старт

1. Создайте файл `.env` на основе примера:

```bash
# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here

# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (если используете PostgreSQL)
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://nikita_bot:your_secure_password_here@postgres:5432/nikita_bot

# Redis Configuration (если используете Redis)
REDIS_URL=redis://redis:6379

# Other Configuration
LOG_LEVEL=info
```

2. Запустите все сервисы:

```bash
docker-compose up -d
```

3. Для запуска только основного приложения (без БД):

```bash
docker-compose up nikita-bot -d
```

## Доступные сервисы

- **nikita-bot** - основное NestJS приложение (порт 3000)
- **redis** - Redis для кеширования (порт 6379) - опционально
- **postgres** - PostgreSQL база данных (порт 5432) - опционально

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f nikita-bot

# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes
docker-compose down -v

# Пересборка образа
docker-compose build nikita-bot

# Запуск в режиме разработки (если нужно)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Структура volumes

- `redis_data` - данные Redis
- `postgres_data` - данные PostgreSQL
- `./logs` - логи приложения (маппинг в контейнер)

## Примечания

- Redis и PostgreSQL сервисы помечены как опциональные
- Если они не нужны, просто удалите их из docker-compose.yml
- Убедитесь, что BOT_TOKEN установлен в .env файле
- Для production рекомендуется использовать Docker secrets для чувствительных данных
