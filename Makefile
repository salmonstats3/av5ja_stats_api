include .env.local

.PHONY: up
up:
	docker-compose --env-file .env.local up

.PHONY: down
down:
	docker-compose --env-file .env.local down -v
