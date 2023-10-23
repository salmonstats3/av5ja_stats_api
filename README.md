## Salmon Stats+

Prisma, Fastify で動作する DB と連携してデータを返す API です.

[ドキュメント](https://docs.splatnet3.com/)も公開しているのでこちらをご一読ください。

## 開発環境構築

### 必要なもの

- git
  - Windowsの方はインストールしてください
- [NodeJS 18.17,1](https://nodejs.org/en/download/releases)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)
- [pgAdmnin](https://www.pgadmin.org/download/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - docker composeは自動でインストールされるので不要です

まずはレポジトリをクローンします。

```zsh
git clone https://github.com/salmonstats3/av5ja_stats_api
cd av5ja_stats_api
```

### 環境変数

環境変数を設定します。

```zsh
cp .env.example .env
```

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

これらを設定したら`docker compose up db`でデータベースのコンテナを立ち上げます。

> db以外は開発環境で立ち上げる必要はありません

起動時にはデータベースが反映されていないので`yarn prisma migrate deploy`を実行します。

### サーバーの起動

`yarn start:dev`で開発環境のサーバーが立ち上がります。

サーバーが起動すると[開発環境](http://localhost:3030)でアクセスできます。

## 本番環境

ARM64/AMD64で実行可能なDockerイメージがあるのでそれを利用してください。

大雑把な設定項目が[`docker-compose.yaml`](docker-compose.yaml)にあるのでそちらを参考にしてください。

### ビルド

マルチステージングビルドを採用して軽量なイメージを作成します。

```zsh
# OSのアーキテクチャに依存
make build

# ARM64/AMD64
make buildx
```

二倍時間はかかりますが、`make buildx`の方が便利です。
