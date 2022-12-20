include .env.local

.PHONY: db
db:
	docker run -d --name salmon_stats_db_dev -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_DB=${POSTGRES_DB} -p 5432:5432 postgres:14.4

.PHONY: down
down:
	docker stop salmon_stats_db_dev
