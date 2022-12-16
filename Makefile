include .env.production

.PHONY: serve
serve:
	yarn start:local

.PHONY: up
up:
	docker-compose --env-file .env.development up

.PHONY: start
start:
	docker-compose --env-file .env.development up -d

.PHONY: down
down:
	docker-compose --env-file .env.development down -v

.PHONY: build
build:
	docker build -t tkgling/salmon-stats-app:${API_VER} .

.PHONY: push
push:
	docker push tkgling/salmon-stats-app:${API_VER}

.PHONY: db
db:
	docker run -d --name salmon_stats_db_dev -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_DB=${POSTGRES_DB} -p 5432:5432 postgres:14.4

.PHONY: db-down
db-down:
	docker stop salmon_stats_db_dev
