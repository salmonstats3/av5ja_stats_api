.PHONY: build
build:
	act --secret-file .secrets --env-file .env -P ubuntu-20.04=ghcr.io/catthehacker/ubuntu:act-20.04 -j build --container-architecture linux/amd64
