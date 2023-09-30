# Salmon Stats+

Prisma, Fastify で動作する DB と連携してデータを返す API です.

詳しいAPIのドキュメントについては[こちら](docs/Usage.md)をどうぞ.

## 導入

```zsh
git clone https://github.com/salmonstats3/av5ja_stats_api
cd av5ja_stats_api
yarn install
```

### 環境変数

以下の環境変数が利用できます.

```zsh
NODE_ENV=
DATABASE_URL=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
API_PORT=
API_HOST=
API_VERSION=

## DB Backup
SCHEDULE=@every 2h
BACKUP_KEEP_DAYS=7
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=
S3_PREFIX=
S3_ENDPOINT=

## Cloudflare DDNS
API_KEY=
API_ZONE=
API_SUBDOMAIN=
API_PROXIED=true
API_RRTYPE=AAAA
```

これらのファイルを設定します.

```zsh
cp .env.example .env
```

#### 接続情報

- `DATABASE_URL`
  - データベースの接続情報
  - `postgresql://{{ POSTGRES_USER }}:{{ POSTGRES_PASSWORD }}@{{ HOST }}:{{ PORT }}/{{ POSTGRES_DB }}`のフォーマット
  - `HOST`はコンテナ内からアクセスするなら`postgres`そうでないなら`localhost`を指定
  - `PORT`は特に何も考えないなら 5432 を指定
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
  - データベースの接続情報
  - `docker compose up postgres`実行時に自動で設定される
- `API_PORT`
  - 開けたいポートを指定
  - 特に何もなければ`3030`を指定します
- `API_HOST`
  - Fastify 用の設定
  - `0.0.0.0`を設定すれば良い
- `API_VERSION`
  - バージョンを指定する
  - 例えば`4.0.0`などの値が有効

#### 自動バックアップ

改良版[`pg-backup-s3`](https://hub.docker.com/repository/docker/tkgling/postgres-backup-s3/general)を利用してAWS S3互換のオブジェクトストレージに定期的にバックアップを取ります.

パラメータについては[本家のドキュメント](https://github.com/eeshugerman/postgres-backup-s3)を参照してください.

> Linode Object Storageでの動作確認をしています

- `SCHEDULE`
  - バックアップ実行間隔
- `BACKUP_KEEP_DAYS`
  - 保存する期間
- `S3_REGION`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_BUCKET`
- `S3_PREFIX`
- `S3_ENDPOINT`
  - S3互換のオブジェクトストレージの接続情報

#### Cloudflare DDNS

`Cloudflare DDNS`を利用して定期的にIPv6アドレスをDNSに反映させます.

- `API_KEY`
- `API_ZONE`
- `API_SUBDOMAIN`
- `API_PROXIED`
  - `true`を指定して良い
- `API_RRTYPE`
  - IPv4なら`A`、IPv6なら`AAAA`を指定

## 実行

### データベース起動

データの書き込みテストなどを行う場合、データベースを起動させる必要があります. Dockerをサポートしているのでそちらをご利用ください.

```zsh
docker compose up postgres
```

で環境変数で設定したユーザー名とパスワードで初期化されます.

もしも永続的に起動したい場合は、

```zsh
docker compsoe up -d postgres
```

としてください.

### サーバー起動

Prismaのファイルに変更を加えた場合、その度に以下の操作が必要です.

```zsh
yarn prisma generate
```

そうでないなら最初の一回だけで構いません.

```zsh
yarn start:dev
```

で[localhost:3030](http://loaclhostL3030/docs)にサーバーが起動します.

> `docs`以下にドキュメントも作成されるのでそちらもご利用ください

### Docker

サーバーをDockerイメージにする場合は`make build`を実行してください. 現在はAMD64しかサポートしていませんが、気が向けばARM64もサポートしたいと考えています.

### AMD64

```zsh
make build
```

### ARM64

記事執筆中です.

## 対応リクエスト

SplatNet3の生データに対応しています. 何も考えずに取得したJSONをそのままリクエストのBodyに突っ込んでPOSTすれば良いです.

|       SplatNet3        |     API      |       処理       |
| :--------------------: | :----------: | :--------------: |
|    CoopHistoryQuery    | v1/histories | スケジュール追加 |
| CoopHistoryDetailQuery |  v1/results  |   リザルト追加   |
|   StageScheduleQuery   | v1/schedules | スケジュール追加 |

Salmon Statsにスケジュールが登録されていないリザルトは404エラーを返すため書き込むことができません. プライベートバイトの場合はこの制約を無視できますが、通常のスケジュールでは必ず対象のリザルトのスケジュールが既に登録されている必要があります. リザルトの書き込みに失敗する場合、まずはスケジュールが正しく書き込まれているかを確認してください.

スケジュール追加のAPIが二つあるのは`StageScheduleQuery`ではプライベートバイトのスケジュールを取得することができないためです. とはいえ、Salmon Statsは基本的に全ての通常のスケジュールを保存してるため特に気にする必要はありません.
