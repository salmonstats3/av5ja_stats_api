include .env

.PHONY: buildx
buildx:
	docker buildx build --build-arg VIRTUAL_PORT=${VIRTUAL_PORT} --push --platform=linux/amd64,linux/arm64 -t tkgling/salmon_stats_app:${API_VERSION} -t tkgling/salmon_stats_app:latest .

.PHONY: build
build:
	docker build --build-arg VIRTUAL_PORT=${VIRTUAL_PORT} --push -t tkgling/salmon_stats_app:${API_VERSION} .
