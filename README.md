# rails-next-nayami-note

## 概要
なやみノート。RailsとNext.jsで構成するポートフォリオ用アプリ。

## 開発環境メモ
- Ruby 3.4.6
- Rails 8.0.3
- "puma", "~> 6.4"
- "mysql2", "~> 0.5.7"
- "pry-byebug"
- "pry-doc"
- "pry-rails"
- "rubocop-faker"
- "rubocop-rails"
- "rubocop-rspec"

- Next.js: 15.5.6
- React: 19.1.0
- TypeScript: ~5.6.3

- MySQL Ver 9.4.0 for macos15.4 on arm64 (Homebrew)
- Docker 未実装
- 起動方法　（現状）
  - `rails s`でlocalhost:3000で確認

## 実装メモ
- ✅ ヘルスチェックAPI（/api/v1/health_check）
- ✅ RSpec導入
- ✅ Rubocop設定

## 開発メモ
- RSpec動作確認用の足し算テストを削除
- .DS_Store削除済み(.gitignoreに追加)
- rubocopルールは書籍準拠『独学ポートフォリオ開発応援 Rails×Next.js×AWS ハンズオン解説』

## 今後
- APIとNext.js接続を確認
- 認証（devise-token-auth）導入
- テスト自動化（GitHub Actions予定）