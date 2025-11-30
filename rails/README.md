## 開発環境メモ
- Ruby 3.4.6
- Rails 8.0.3
- "puma", "~> 6.4"
- "mysql2", "~> 0.5.7"

## 開発メモ
- RSpec動作確認用の足し算テストを削除
- rubocopルールは書籍準拠『独学ポートフォリオ開発応援 Rails×Next.js×AWS ハンズオン解説』

### 疎通確認
- corsを利用して、next.jsからのアクセスを許可
- corsの環境変数をconfig/settings/直下のファイルで管理

## 劣後メモ
- railsの適したメソッド利用
- DBのカラムの調整
- バリデーションの調整
- showがいるのか検討
- corsがいるのか検討