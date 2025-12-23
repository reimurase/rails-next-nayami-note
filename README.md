# rails-next-nayami-note

## 概要
書いて発見。書いて発展。
そして、さっさと忘れよう。
なやみノート。RailsとNext.jsで構成するポートフォリオ用アプリ。

## 開発環境メモ
- Ruby 3.4.6
- Rails 8.0.3
- "puma", "~> 6.4"
- "mysql2", "~> 0.5.7"

- Node.js: 20.18.0 (LTS)
- Next.js: 15.5.6
- React: 19.1.0
- TypeScript: ~5.6.3
- ESlint (flat config): 9.38.0
- @typescript-eslint: 8.46.2

- MySQL Ver 9.4.0 for macos15.4 on arm64 (Homebrew)
- Docker 未実装
- 起動方法　（現状）
  - `rails s`でlocalhost:3000で確認
  - `npm run dev`でlocalhost:3001で確認

## 開発メモ

### GitHub Actionsの設定
- GitHub Actions では MySQL の root 接続を許可するため
MYSQL_ROOT_HOST: "%" と ports: 3306:3306 を設定しています。
- rails,nextでフォルダが別構成のため、working-directoryでジョブの動く環境を明示しています。

### rails-next疎通確認
- サーバーコンポーネントの疎通はトップページに表示し、一時的な確認とする
- クライアントコンポーネントの疎通はコード参考の観点から残す

## 実装メモ
- ✅ ヘルスチェックAPI（/api/v1/health_check）
- ✅ RSpec導入
- ✅ Rubocop設定
- ✅ next.jsをインストール
- ✅ ESlintを導入
- ✅ prettierを導入
- ✅ GitHub ActionsでCI自動化設定を追加
- ✅ MUIの導入
- ✅ rails, next.js の疎通確認
- ✅ Renderへ初回デプロイを実施
- ✅ Jest + React Testing Library の導入
- ✅ FactoryBot / Faker の導入
- ✅ i18n rails全体に日本語設定導入
- ✅ concernのcreate API を実装（簡易）
- ✅ concernのフォームを実装
- ✅ concernの一覧表示を実装
- ✅ concernの編集機能を実装
- ✅ concernの削除機能を実装
- ✅ ConcernRowの機能を実装
- ✅ 一覧ページでCRUDを完結させる
- ✅ concernの詳細機能APIを残す
- ✅ Concern trigger_eventカラムを追加
- ✅ APIのバリデーションを強化
- ✅ UIのバリデーションを強化
- ✅ APIのエラーレスポンスを整備
- ✅ フロントエンド側でAPIのエラー処理を追加


## 今後
- ログイン機能の実装
- issue, roadmap に拡張
- UIの強化