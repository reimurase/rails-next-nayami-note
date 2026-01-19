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
- そもそも、技術選定の理由
- ツールの採用理由をもう少し、詰める
- ✅ ヘルスチェックAPI（/api/v1/health_check）
- ✅ RSpec導入
  - 導入理由
- ✅ Rubocop設定
- ✅ next.jsをインストール
- ✅ ESlintを導入
- ✅ prettierを導入
  - ここのルール指針をちゃんと理解するのと裏取り
- ✅ GitHub ActionsでCI自動化設定を追加
- ✅ MUIの導入
  - 導入理由が少し弱い
- ✅ rails, next.js の疎通確認
- ✅ Renderへ初回デプロイを実施
- ✅ Jest + React Testing Library の導入
  - 導入理由が弱い
- ✅ FactoryBot / Faker の導入
- ✅ i18n rails全体に日本語設定導入
- ✅ concernのcreate API を実装（簡易）
  - `.save`と`.save!` とかの採用理由
  - 
  - テストの検証理由とどこらへんで担保していると判断しているのか
  - バリデーションの判断理由
- ✅ concernのフォームを実装
- ✅ concernの一覧表示を実装
- ✅ concernの編集機能を実装
- ✅ concernの削除機能を実装
- ✅ ConcernRowの機能を実装
  - ここなんでこの仕様なのか
- ✅ 一覧ページでCRUDを完結させる
- ✅ concernの詳細機能APIを残す
 - 詳細の扱いについて
- ✅ Concern trigger_eventカラムを追加
 - カラムの方針
- ✅ APIのバリデーションを強化
- ✅ UIのバリデーションを強化
 - next.jsのコードの根拠が弱い
 - apiの窓口に関しての知識
 - テストの設計とその内容を説明できるか
- ✅ APIのエラーレスポンスを整備
- ✅ フロントエンド側でAPIのエラー処理を追加
- ✅ Userモデルの実装
- ✅ Userのsignup機能の実装
----------ここまで以前は検証必要-----------
- ✅ セッションAPI（ログイン/ログアウト/me）を実装
- user / session / me の構造採用理由
- クッキーの採用理由
- ✅ userとconcernを関連付け
- ✅ 一覧でCRUD完結のためshow削除
- ✅ CSRF対策機能を有効化
- ✅ サインアップ/ログインUIを実装

## 今後
- ログイン機能の実装
  - PR7 Next：サインアップ/ログインUI
    - corsの確認
    - UnauthorizedErrorの処理が正常に動作すること
    - アクセスしようとしたURLに遷移
    - エラーメッセージ
    - バリデーション追加
  - PR8 Next：認証ガード（最小）
  - PR9 バリデーション強化
    - email, passwordのバリデーションを強化
    - Cookieのその他の対策を調べる
  - v2（対策フェーズ：必要になったら）
- UIの強化
- なやみノートのバージョン1.0を提示するべき