## av5ja_stats_api

Prisma, Fastify で動作する DB と連携してデータを返す API です.

### 導入

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

```zsh
docker compose up postgres
```

で環境変数で設定したユーザー名とパスワードで初期化される.

#### 同期

データベースを指定したスキーマに従って初期化します.

```zsh
yarn prisma migrate dev
```

もしリセットしたい場合は、

```zsh
yarn prisma migrate reset --hard
```

でデータを初期化した上でスキーマを反映させられます.

## トークンに含まれる情報

認証時に必要になる ID は、`client_id`, `na_id`, `coral_user_id`の三つです. `nsa_id`自体は何か必要になりませんが ID であるので一応載せておきます.

このうち`client_id`は常に固定値`71b963c1b7b6d119`なのでここでは考えなくても問題ありません.

|                  |  client_id  |    na_id    |             nsa_id             |       coral_user_id        |
| :--------------: | :---------: | :---------: | :----------------------------: | :------------------------: |
|   SessionToken   | payload.aud | payload.sub |               -                |             -              |
|   AccessToken    | payload.aud | payload.sub |               -                |             -              |
|     IdToken      | payload.aud | payload.sub |               -                |             -              |
| GameServiceToken |      -      |      -      |       result.user.nsaId        | payload.sub/result.user.id |
|   GameWebToken   |      -      |      -      | links.networkServiceAccount.id |        payload.sub         |

`na_id`は GameServiceToken を取得する際に必要な`f`の計算に必要です. `coral_user_id`は GameWebToken を取得する際に必要な`f`の計算に必要です.
