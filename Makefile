install:
	npm install

run:
	npm run dev

dev:
	docker compose up -d
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
