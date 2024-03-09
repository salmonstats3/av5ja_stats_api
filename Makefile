AUTHOR := $(shell cat package.json | jq -r '.author')
VERSION := $(shell cat package.json | jq -r '.version')
NAME := $(shell cat package.json | jq -r '.name')

include .env

.PHONY: build
build:
	docker buildx build --build-arg APP_PORT=${APP_PORT} --build-arg APP_HOST=${APP_HOST} --build-arg APP_VERSION=${APP_VERSION} --push --platform=linux/amd64,linux/arm64 -t ${AUTHOR}/${NAME}:${VERSION} -t ${AUTHOR}/${NAME}:latest .

.PHONY: down
down:
	docker-compose down --rmi all --volumes --remove-orphans

.PHONY: up
up:
	docker-compose up --build --force-recreate

.PHONY: remove
remove:
	docker rm $(docker ps -aq) -f && docker rmi $(docker images -q) -f && docker rmi $(docker images -f 'dangling=true' -q) -f
