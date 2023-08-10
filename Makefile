.PHONY: build
build:
	act -j build -P node:16-buster-slim --container-architecture linux/amd64 --secret-file .secrets
