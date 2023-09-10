<p align="center">
  <img alt="GitHub Workflow Status (with event)" src="https://img.shields.io/github/actions/workflow/status/SalmonStats3/salmonstats_api/build.yaml">
  <img alt="GitHub" src="https://img.shields.io/github/license/salmonstats3/salmonstats_api">
  <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/SalmonStats3/salmonstats_api">
  <img alt="Node" src="https://img.shields.io/badge/node-v18.17.0-green">
  <img alt="NestJS" src="https://img.shields.io/badge/nest-v10.1.3-blue">
  <img src="https://img.shields.io/badge/-NintendoSwitch-E60012.svg?logo=nintendoswitch&style=popout">
  <img src="https://img.shields.io/badge/XProductVersion-2.7.0-8F8F8F.svg?logo=nintendoswitch&style=popout">
  <img src="https://img.shields.io/badge/XWebViewVer-4.0.0-8F8F8F.svg?logo=nintendoswitch&style=popout">
  <img src="https://img.shields.io/badge/-Prettier-F7B93E.svg?logo=prettier&style=popout">
  <img src="https://img.shields.io/badge/-Postgresql-336791.svg?logo=postgresql&style=popout">
  <img src="https://img.shields.io/badge/-Eslint-4B32C3.svg?logo=eslint&style=popout">
  <img src="https://img.shields.io/badge/-Typescript-007ACC.svg?logo=typescript&style=popout">
  <img src="https://img.shields.io/badge/-Node.js-339933.svg?logo=node.js&style=popout">
  <img src="https://img.shields.io/badge/-Netlify-00C7B7.svg?logo=netlify&style=popout">
</p>

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
