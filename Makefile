include .env

.PHONY: buildx
buildx:
	docker buildx build --build-arg API_PORT=${API_PORT} --push --platform=linux/amd64,linux/arm64 -t tkgling/salmon_stats_app:${API_VERSION} .

.PHONY: build
build:
	docker build --build-arg VIRTUAL_PORT=${VIRTUAL_PORT} -t tkgling/salmon_stats_app:${API_VERSION} .
