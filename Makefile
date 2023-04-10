include .env

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose up -d

.PHONY: build
build:
	docker build -t tkgling/salmon-stats-app:${API_VER} .
