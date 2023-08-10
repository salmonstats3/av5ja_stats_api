.PHONY: build
build:
	act --secret-file .secrets --env-file .env -P ubuntu-20.04=node:16-buster-slim -j build --container-architecture linux/amd64

.PHONY: deploy
deploy:
	act --secret-file .secrets --env-file .env -P ubuntu-20.04=ghcr.io/catthehacker/ubuntu:act-20.04 -j deploy --container-architecture linux/amd64
