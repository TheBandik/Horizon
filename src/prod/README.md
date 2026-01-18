# Horizon – Production Deployment

## Переменные окружения (`.env.prod`):
```bash
POSTGRES_DB=horizon  
POSTGRES_USER=horizon  
POSTGRES_PASSWORD=strong-password

JWT_SECRET=very-long-random-secret  
CAPTCHA_SECRET_KEY=yandex-smartcaptcha-secret
TEST_BYPASS=test-bypass

BACKUP_SCHEDULE=30 3 * * *
BACKUP_RETENTION_DAYS=14

S3_ENDPOINT=https://storage.yandexcloud.net  
S3_BUCKET=bandik-horizon  
S3_REGION=ru-central1  
S3_ACCESS_KEY_ID=xxxxxxxx  
S3_SECRET_ACCESS_KEY=xxxxxxxx  
S3_PREFIX=backups
```

**Файл `.env.prod` обязателен для запуска**  
Отсутствие любого секрета приводит к неработоспособности backend.

## Запуск production:
```bash
docker compose -p horizon-prod --env-file .env.prod up -d
```

## Запуск с пересборкой образов:
```bash
docker compose -p horizon-prod --env-file .env.prod up -d --build
```

## Управление сервисами:

- **Перезапуск backend**:
  ```bash
  docker compose -p horizon-prod restart backend
  ```

- **Перезапуск backend с пересборкой**:
  ```bash
  docker compose -p horizon-prod up -d --build backend
  ```

- **Проверка состояния контейнеров**:
  ```bash
  docker compose -p horizon-prod ps
  ```

- **Логи**:
  ```bash
  docker compose -p horizon-prod logs -f backend  
  docker compose -p horizon-prod logs -f caddy  
  docker compose -p horizon-prod logs -f db-backup
  ```

- **Остановка production (данные сохраняются в volumes)**:
  ```bash
  docker compose -p horizon-prod down
  ```

## Бэкапы базы данных:
PostgreSQL бэкапится автоматически через `pg_dump` с последующей загрузкой в Yandex Object Storage.  
Расписание и хранение управляются через:
- `BACKUP_SCHEDULE`
- `BACKUP_RETENTION_DAYS`

Бэкапы не зависят от жизненного цикла контейнеров.

## Полезные команды:
- **Проверка health backend**:
  ```bash
  docker inspect --format='{{.State.Health.Status}}' horizon-prod-backend-1
  ```

- **Полный рестарт production**:
  ```bash
  docker compose -p horizon-prod down  
  docker compose -p horizon-prod --env-file .env.prod up -d --build
  ```
