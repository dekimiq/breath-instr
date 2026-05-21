# breath-instr

Лендинг с ИИ (чат с помошником)

## Стек

- **Next.js 16** (standalone SSR) — фронт + API routes
- **PostgreSQL 16** — база данных
- **Nginx** — точка входа, TLS termination, статика
- **Apache** — reverse proxy, SSE pass-through
- **Prometheus + Grafana** — мониторинг

---

## Локальная разработка

### Требования

- Node.js 22+
- Docker + Docker Compose

### Быстрый старт

```bash
# 1. Клонируем и устанавливаем зависимости
git clone <repo>
cd breath-instr
npm install

# 2. Копируем переменные окружения
cp .env.example .env
# Заполнить .env: OPENROUTER_API_KEY, JWT_SECRET и остальное

# 3. Поднимаем БД и запускаем dev-сервер
make dev
```

Приложение доступно на [http://localhost:3000](http://localhost:3000).

### Переменные окружения

| Переменная | Описание |
|---|---|
| `OPENROUTER_API_KEY` | API ключ OpenRouter |
| `JWT_SECRET` | 32-байтный hex-секрет для JWT (64 символа) |
| `POSTGRES_USER` | Пользователь БД |
| `POSTGRES_PASSWORD` | Пароль БД |
| `POSTGRES_DB` | Имя базы данных |
| `DATABASE_URL` | Полный connection string PostgreSQL |
| `DOMAIN` | Домен сайта (для прода) |
| `GRAFANA_USER` | Логин Grafana (для прода) |
| `GRAFANA_PASSWORD` | Пароль Grafana (для прода) |
| `ENCRYPTION_KEY` | 32-символьный ключ для шифрования токенов в БД |

Сгенерировать `JWT_SECRET` и `ENCRYPTION_KEY`:
```bash
# Для JWT_SECRET (64 символа hex)
openssl rand -hex 32

# Для ENCRYPTION_KEY (ровно 32 символа)
openssl rand -base64 32 | cut -c1-32
```

### База данных

```bash
# Применить схему
make db-setup

# Заполнить начальными данными
make seed
```

---

## Деплой на VPS

### Требования

- Ubuntu 22.04+
- Docker + Docker Compose
- Домен с DNS A-записью

### 1. Подготовка сервера

```bash
# Клонируем репозиторий
git clone <repo>
cd breath-instr

# Копируем и заполняем переменные
cp .env.example .env
nano .env
```

Обязательно заполнить в `.env`:
```env
DOMAIN=yourdomain.com
OPENROUTER_API_KEY=...
JWT_SECRET=...          # openssl rand -hex 32
POSTGRES_PASSWORD=...   # сильный пароль
GRAFANA_PASSWORD=...    # сильный пароль
ENCRYPTION_KEY=...      # 32 символа для шифрования токенов
```

### 2. Первый запуск

```bash
make prod
```

При старте `jonasal/nginx-certbot` автоматически запрашивает сертификат Let's Encrypt для домена из `DOMAIN` и в дальнейшем обновляет его сам. Ручных действий с SSL не требуется.

> Первый старт может занять 1-2 минуты — контейнер генерирует Diffie-Hellman параметры.

### 3. Инициализация БД и создание админа

Запускается на сервере. Команда выполнит миграции и создаст админа внутри запущенного контейнера `app`.

```bash
make prod-seed
```

Команда применит схему и создаст администратора. В консоли появится:

```
✅ Admin user created:
   Login: admin_a1b2c3
   Password: d4e5f6a7b8c9d0e1
```

**Это логин и пароль от админки, нужно сохранить**.

Сайт доступен на `https://yourdomain.com`.

### Пересборка после изменений

```bash
# Пересобрать и перезапустить только app (nginx/apache/БД не трогаем)
make rebuild
```

### Полезные команды

```bash
make logs           # логи всего стека
make logs-s s=nginx # логи конкретного сервиса
make stop           # остановить стек
```

### Мониторинг

Grafana доступна на `http://your-server-ip:3001`  
Логин/пароль — из `.env` (`GRAFANA_USER` / `GRAFANA_PASSWORD`).
