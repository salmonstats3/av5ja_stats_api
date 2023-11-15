## Salmon Stats+

Prisma, Fastify で動作する DB と連携してデータを返す API です.

[ドキュメント](https://docs.splatnet3.com/)も公開しているのでこちらをご一読ください。

## ゲームのアップデートによる要変更箇所

プログラムでEnumで管理しているものはゲームのアップデートにより、追加要素が発生したときに正しく動作しなくなります。

Salmon Stats+ではEnum定義外の値についてはサーバーが受け付けないようになっているため、リザルトのアップロードができなくなります。

基本的には下記のファイルに値を追加するだけで動作するようになるはずなので、変更を加えてからPRを出していただければと思います。

### シーズンごとに追加されるもの

- [ブキ](/src/utils/enum/weapon_info_main.ts)
- [バイトツナギ](/src/utils/enum/coop_skin_id.ts)
- [ステージ](/src/utils/enum/coop_stage_id.ts)

### 稀に追加されるもの

- [オカシラシャケ](/src/utils/enum/coop_enemy_id.ts)

### まだ追加されたことがないもの

- [スペシャル](/src/utils/enum/weapon_info_special.ts)
- [称号](/src/utils/enum/coop_grade_id.ts)
- [イベント](/src/utils/enum/event_wave.ts)

### 追加されなさそうなもの

- [潮位](/src/utils/enum/water_level.ts)

## 開発環境構築

macOSでの開発環境構築手順について解説します。

- [Homebrew](https://brew.sh/)
- [pgAdmnin](https://www.pgadmin.org/download/)
  - 絶対に必要なものではありませんが、あると便利です
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - docker composeは自動でインストールされるので不要です

### Node Version Manager

```zsh
brew install nvm
```

インストールが完了したら`~/.zshrc`を編集します。

```zsh
export NVM_DIR="$HOME/.nvm"

[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
```

とすれば`.nvmrc`があるディレクトリを開いた際に自動でバージョンを切り替えてくれます。

### プロジェクトのクローン

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

ローカル実行に最低限必要な環境変数は以下の七つです。

```zsh
DATABASE_URL=
POSTGRES_DB=
POSTGRES_PASSWORD=
POSTGRES_USER=

API_VERSION=
API_PORT=
API_HOST=
```

| キー              | 意味                   | 備考                | 
| :---------------: | :--------------------: | :-----------------: | 
| DATABASE_URL      | 下記三つから生成される | -                   | 
| POSTGRES_DB       | データベース           | -                   | 
| POSTGRES_PASSWORD | パスワード             | -                   | 
| POSTGRES_USER     | ユーザー名             | -                   | 
| API_VERSION       | バージョン             | 4.0.0みたいな文字列 | 
| API_PORT          | ポート番号             | 3030推奨            | 
| API_HOST          | ホスト                 | 0.0.0.0推奨         | 

`API_HOST`についてはfastifyをDockerで動作させるために必要な値で、特に何も考えずに0.0.0.0を指定すればよいです。

これらを設定したら`docker compose up db`でデータベースのコンテナを立ち上げます。

> db以外は開発環境で立ち上げる必要はありません

起動時にはデータベースが反映されていないので`yarn prisma migrate deploy`を実行します。

### サーバーの起動

`yarn start:dev`で開発環境のサーバーが立ち上がります。

サーバーが起動すると[開発環境](http://localhost:3030)でアクセスできます。

DBの中身を見たいときは`yarn prisma studio`などで確認できます。

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
