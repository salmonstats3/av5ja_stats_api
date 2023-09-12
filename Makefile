include .env

.PHONY: build
build:
	docker build -t tkgling/salmon-stats-app:${API_VER} .
