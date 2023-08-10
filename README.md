## Description

> This repository does not contain any contents copyrighted by Nintendo Co., Ltd.

## Get started

- To check API documents, visit [docs.splatnet3.com](https://docs.splatnet3.com)

```
git clone https://github.com/SalmonStats3/salmonstats_api
cd salmonstats_api
yarn
yarn start:dev
```

#### Environment Values

Environment values contain a credentials for [Docker Hub](https://hub.docker.com/)

```zsh
cp .env.sample .env
```

Copy and edit `.env` following format.

```
# OpenAPI
OPENAPI_TITLE=
OPENAPI_DESCRIPTION=

# Node
NODE_ENV=
PORT=

# SplatNet3
API_VER=
F_SERVER_URL=https://api.imink.app/f
SESSION_TOKEN=

# Prisma
DATABASE_URL=
```

To checkout the detail, please read [wiki]().

#### Secrets

Secrets contain a credentials for [Docker Hub](https://hub.docker.com/)

```zsh
cp .secrets.sample .secrets
```

Copy and edit `.secrets` following format.

```
DOCKERHUB_USERNAME=
DOCKERHUB_TOKEN=
```

## Run

```zsh
yarn install
yarn start:dev 
```

### Format

```zsh
yarn format
```

### Lint

```zsh
yarn lint
```

## GitHub Actions

Using [`act`](https://github.com/nektos/act), GitHub Actions executed in the local environment.

- act
- make

```zsh
sudo apt install make act
```

### Build and push docs

```zsh
make build
```

### Build and push docker image

```zsh
make deploy
```

## License

Salmon Stats is [MIT licensed](https://github.com/SalmonStats3/salmonstats_api/blob/develop/4.0.0/LICENSE).
