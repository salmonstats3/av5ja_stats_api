include .env.prod

.PHONY: up
up:
	docker-compose up -d

.PHONY: start
start:
	docker compose up

.PHONY: down
down:
	docker-compose down -v

.PHONY: build
build:
	docker build -t tkgling/salmon-stats-app:${API_VER} .

.PHONY: push
push:
	docker push tkgling/salmon-stats-app:${API_VER}
