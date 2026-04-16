# なやみノート
> 書いて発見。書いて発展。そして、さっさと忘れよう。

## 概要
なやみノートは思考の可視化や発展をサポートし、なやみをストレスなく忘れるためのサービスです。もやもやを抱えている人や考えが整理できない人が構造的になやみを扱えるようにしています。RailsとNext.jsで構成されるポートフォリオ用サービスです。

## リンク

## サービス概要 / 作成背景
興味がある方はご覧ください
(https://github.com/reimurase/rails-next-nayami-note/issues/54)

## 機能

| 機能 | 説明 |
|------|------|
| ユーザー登録・ログイン・ログアウト | メールアドレスとパスワードによる認証 |
| ゲストログイン | 登録不要ですぐに試せる |
| パスワードリセット | メールによるトークン認証でリセット |
| なやみの作成・編集・削除 | トリガーとなった出来事とともになやみを記録 |
| なやみのアーカイブ | 解消したなやみをアーカイブして手放す |
| 自動アーカイブ | 設定した日数（7日）後になやみを自動でアーカイブ |
| 問題（Issue）の作成・編集・削除 | なやみから問題を抽出して整理 |
| ロードマップの作成・編集・削除 | 問題への対処方針を記録 |
| ライブラリ | アーカイブ済みのなやみ・問題・ロードマップの一覧 |

## 技術スタック

### バックエンド

| 技術 | バージョン |
|------|-----------|
| Ruby | 3.4.6 |
| Ruby on Rails | 8.0.3 |
| MySQL | 9.4.0 |
| Puma | ~6.4 |
| bcrypt（has_secure_password） | ~3.1 |
| rack-cors | - |

### フロントエンド

| 技術 | バージョン |
|------|-----------|
| Node.js | 20.18.0 |
| Next.js | 15.5.6 |
| React | 19.1.0 |
| TypeScript | ~5.6.3 |
| MUI（Material UI） | 7.3.5 |
| Axios | 1.13.2 |
| SWR | 2.3.6 |

### テスト・開発

| 技術 | 用途 |
|------|------|
| RSpec | Rails のテスト |
| Jest + Testing Library | Next.js のテスト |
| GitHub Actions | CI（Rails / Next.js） |

## アーキテクチャ概要

## 工夫した点

## 今後実装したい機能

## ローカル環境構築手順

### Docker を使う場合（推奨）

#### 前提
- Docker / Docker Compose

#### 1. リポジトリをクローン

```bash
git clone https://github.com/reimurase/rails-next-nayami-note.git
cd rails-next-nayami-note
```

#### 2. 環境変数を設定

```bash
cp .env.example .env
```

`.env` を編集して `DB_PASSWORD` に任意のパスワードを設定します。

```
DB_PASSWORD=yourpassword
DB_NAME_DEV=nayami_note_development
DB_NAME_TEST=nayami_note_test
```

#### 3. イメージをビルド

```bash
docker compose build
```

#### 4. DB のセットアップ

```bash
docker compose run --rm rails rails db:create db:migrate db:seed
```

#### 5. 起動

```bash
docker compose up
```

ブラウザで `https://localhost:3001` にアクセスします。

> Next.js は HTTPS で起動するため、初回はオレオレ証明書の警告が出ます。「詳細設定 → 続行」を選択してください。

---

<details>
<summary>手動セットアップ（Docker を使わない場合）</summary>

#### 前提
- Ruby 3.4.6
- Node.js 20.18.0
- MySQL 9.4.0

#### 1. リポジトリをクローン

```bash
git clone https://github.com/reimurase/rails-next-nayami-note.git
cd rails-next-nayami-note
```

#### 2. Rails セットアップ

```bash
cd rails
bundle install
```

`config/master.key` を用意した上で、必要に応じて環境変数を設定します（デフォルトは `root` / パスワードなし / `127.0.0.1:3306`）。

```bash
rails db:create db:migrate db:seed
```

#### 3. Next.js セットアップ

```bash
cd ../next
npm install
```

`.env.local` を作成します。

```
NEXT_PUBLIC_API_BASE_URL=https://localhost:3000
API_BASE_URL=https://localhost:3000
```

#### 4. 起動

ターミナルを2つ使って、それぞれ起動します。

```bash
# Rails（ポート 3000）
cd rails
rails s
```

```bash
# Next.js（ポート 3001）
cd next
npm run dev
```

ブラウザで `https://localhost:3001` にアクセスします。

> Next.js は `--experimental-https` で起動するため、初回はオレオレ証明書の警告が出ます。ブラウザで「詳細設定 → 続行」を選択してください。

</details>

### GitHub Actionsの設定
- GitHub Actions では MySQL の root 接続を許可するため
MYSQL_ROOT_HOST: "%" と ports: 3306:3306 を設定しています。
- rails,nextでフォルダが別構成のため、working-directoryでジョブの動く環境を明示しています。

### rails-next疎通確認
- サーバーコンポーネントの疎通はトップページに表示し、一時的な確認とする
- クライアントコンポーネントの疎通はコード参考の観点から残す


