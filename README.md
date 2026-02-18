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