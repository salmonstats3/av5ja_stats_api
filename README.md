# Salmon Stats+

Prisma, Fastify で動作する DB と連携してデータを返す API です.

## 導入

Dockerを利用するのが最も便利です。ARM64とAMD64に対応しています。

### 環境変数

最低限必要な環境変数は以下の七つです。

```zsh
DATABASE_URL=
POSTGRES_DB=
POSTGRES_PASSWORD=
POSTGRES_USER=

API_VERSION=
API_PORT=
API_HOST=
```

これらを設定したら`docker compose up`でコンテナを立ち上げます。

### データベースの初期化

起動時にはデータベースが反映されていないので`yarn prisma migrate deploy`
