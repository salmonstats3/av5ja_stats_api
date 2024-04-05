## Salmon Stats+

> This repository does not contain any contents copyrighted by Nintendo Co., Ltd.

### 利用している技術

- [NestJS](https://github.com/nestjs/nest)
  - TypeScriptを利用したWeb APIフレームワーク
- [Fastify](https://github.com/fastify/fastify)
  - Expressよりも高速なフレームワーク
- [Bun](https://github.com/oven-sh/bun)
  - 最速・高機能のJavaScriptランタイム
- [SWC](https://github.com/swc-project/swc)
  - Rustで書かれた最速のトランスパイラ
- [Prisma](https://github.com/prisma/prisma)
  - 次世代オブジェクト関係マッピング

### 開発方法

Gitからクローンする方法とDockerイメージを利用する方法がありますが、開発の場合はGitから利用するのが良いです

```zsh
git clone https://github.com/salmonstats3/av5ja_stats_api.git
cd av5ja_stats_api
```

#### DevContainerを利用する(推奨)

VSCodeで`.devcontainer`のディレクトリを開きます

```zsh
bun install
bun start:dev
```

#### ローカルで開発する

```zsh
bun install
bun start:dev
```

#### docker-composeを利用した方法

docker-composeを利用することで必要なサービスを一括で立ち上げることができます

```zsh
docker compose up -d
```

環境変数が必要になるので以下の値を`.env`に書き込んでください。

```
NODE_ENV=
APP_PORT=
APP_HOST=
APP_VERSION=
DATABASE_URL=
POSTGRES_DB=
POSTGRES_PASSWORD=
POSTGRES_USER=
WEBHOOK_URL= #オプショナル
```
