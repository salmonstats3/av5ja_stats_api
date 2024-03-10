AUTHOR := $(shell cat package.json | jq -r '.author')
VERSION := $(shell cat package.json | jq -r '.version')
NAME := $(shell cat package.json | jq -r '.name')

include .env

.PHONY: build
build:
	docker buildx build --platform=linux/amd64,linux/arm64 -t ${AUTHOR}/${NAME}:${VERSION} -t ${AUTHOR}/${NAME}:latest .

.PHONY: down
down:
	docker-compose down --rmi all --volumes --remove-orphans

.PHONY: up
up:
	docker-compose up --build --force-recreate

.PHONY: act
act:
	act -W .github/workflows/deploy.yaml pull_request -e pull_request.json
