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
	docker buildx build --platform linux/amd64,linux/arm64 -t tkgling/salmon-stats-app:${API_VER} --push .

.PHONY: push
push:
	docker push tkgling/salmon-stats-app:${API_VER}
