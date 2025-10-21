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

- MySQL Ver 9.4.0 for macos15.4 on arm64 (Homebrew)
- Docker 未実装
- 起動方法　（現状）
  - `rails s`でlocalhost:3000で確認

## 実装メモ
- ✅ ヘルスチェックAPI（/api/v1/health_check）
- ✅ RSpec導入
- ✅ Rubocop設定
- ⏳ 認証機能これから

## 開発メモ
- RSpec動作確認用の足し算テストは削除予定
- .DS_Store削除済み
- rubocopルールは書籍準拠『独学ポートフォリオ開発応援 Rails×Next.js×AWS ハンズオン解説』

## 今後
- APIとNext.js接続を確認
- 認証（devise-token-auth）導入
- テスト自動化（GitHub Actions予定）