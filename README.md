## Salmon Stats+

Prisma, Fastify で動作する DB と連携してデータを返す API です.

### 導入

```zsh
git clone https://github.com/salmonstats3/av5ja_stats_api
cd av5ja_stats_api
yarn install
```

### データベース接続情報

データベースへの接続情報は`.env`に設定します.

```zsh
cp .env.example .env
```

ここに任意の値を設定します. この内容は自動的に Docker で動作するデータベースに反映されます.

- NodeJS 18.17.0
- Yarn
- Node Version Managerß

```zsh
git clone https://github.com/salmonstats3/av5ja_stats_api.git
cd av5ja_stats_api
yarn install
```

### 環境変数

```zsh
DATABASE_URL=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
APP_PORT=
API_HOST=
API_VERSION=
```

- DATABASE_URL
  - データベースの接続情報
  - `postgresql://{{ POSTGRES_USER }}:{{ POSTGRES_PASSWORD }}@{{ HOST }}:{{ PORT }}/{{ POSTGRES_DB }}`のフォーマット
  - `HOST`はコンテナ内からアクセスするなら`postgres`そうでないなら`localhost`を指定
  - `PORT`は特に何も考えないなら 5432 を指定
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
  - データベースの接続情報
  - `docker compose up postgres`実行時に自動で設定される
- API_PORT
  - 開けたいポートを指定
  - 特に何もなければ`3030`を指定します
- API_HOST
  - Fastify 用の設定
  - `0.0.0.0`を設定すれば良い
- API_VERSION
  - バージョンを指定する
  - 例えば`4.0.0`などの値が有効

### データベースの起動

DATABASE_URL=
POSTGRES_DB=
POSTGRES_PASSWORD=
POSTGRES_USER=

````

### データベース起動

```zsh
docker compose up postgres
````

で環境変数で設定したユーザー名とパスワードで初期化される.

#### 同期

データベースを指定したスキーマに従って初期化します.
PGAdmin などでデータベースに接続してください.

### データベース初期化

```zsh
yarn prisma generate
```

`yarn prisma generate`でソースコードを生成し、`yarn prisma migrate dev --create-only`でマイグレーション用の SQL を発行します.

```zsh
yarn prisma migrate dev --create-only
yarn prisma migrate deploy
```

発行済の SQL を反映させるには`migrate deploy`を実行します. このコマンドを一度に実行したい場合は、

```zsh
yarn prisma migrate dev
```

もしリセットしたい場合は、

```zsh
yarn prisma migrate reset --hard
```

でデータを初期化した上でスキーマを反映させられます.
で行えます.

### データベース初期化

```zsh
yarn prisma migrate reset
```

データベースを初期化したあと、生成済みの SQL をデータベースに対して実行します.
