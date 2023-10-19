include .env

.PHONY: buildx
buildx:
	docker buildx build --push --platform=linux/amd64,linux/arm64 -t tkgling/salmon_stats_app:latest .

.PHONY: build
build:
	docker build -t tkgling/salmon_stats_app:latest .
