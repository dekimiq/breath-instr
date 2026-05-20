# !========== Prod ==========! 

# Первый деплой: сборка образа + поднятие всего стека
prod:
	docker compose up -d --build

# Пересобрать только app-контейнер и перезапустить без даунтайма остальных
rebuild:
	docker compose build app
	docker compose up -d --no-deps app

# Полная остановка стека
stop:
	docker compose down

# Логи всего стека
logs:
	docker compose logs -f

# Логи конкретного сервиса: make logs-s s=nginx
logs-s:
	docker compose logs -f $(s)

# !========== Dev ==========! 

install:
	npm install

run:
	npm run dev

dev:
	docker compose up -d postgres
	npm run dev

down:
	docker compose down

build:
	npm run build

prett:
	npm run prett

prett-fix:
	npm run prett:fix

lint:
	npm run lint

lint-fix:
	npm run lint:fix

db-setup:
	npx drizzle-kit generate
	npx drizzle-kit push

seed:
	npx tsx src/db/seed.ts

# Прод: применить схему и создать админа (запускать один раз после make prod)
# Логин и пароль будут выведены в консоль
prod-seed:
	docker compose exec app npx drizzle-kit push
	docker compose exec app npx tsx src/db/seed.ts

setup:
	docker compose up -d
	npm install
	npx drizzle-kit push
	npx tsx src/db/seed.ts
