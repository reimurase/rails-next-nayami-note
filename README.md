# rails-next-nayami-note

## 概要
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

## 実装メモ
- ✅ ヘルスチェックAPI（/api/v1/health_check）
- ✅ RSpec導入
- ✅ Rubocop設定
- ✅ next.jsをインストール
- ✅ ESlintを導入

## 開発メモ
- RSpec動作確認用の足し算テストを削除
- .DS_Store削除済み(.gitignoreに追加)
- rubocopルールは書籍準拠『独学ポートフォリオ開発応援 Rails×Next.js×AWS ハンズオン解説』
### Node.js
- Version: 20.18.0（LTS）
- 理由: Next.js 15 / ESLint 9 系との互換性を保つため固定
- `.nvmrc` に明記し、ローカル・CI環境の差異を防止
### ESlintルール方針
目的

破壊的なバグの予防と、読みやすさの最低限の統一を両立する（開発の手を止めない）
構成

Flat Config 形式（eslint.config.js）
技術スタック対応：TypeScript / React Hooks / Next.js（Core Web Vitals）
Node: 20.18.0（nvm / .nvmrc で固定）

適用範囲

src/ 配下の *.{ts,tsx,js,jsx}
node_modules/, .next/, dist/, out/ は除外

主なルール

ベース：eslint:recommended（JSの安全網）
Hooks：react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
Next：@next/next の Core Web Vitals セット
使い勝手：no-console: warn (warn/errorのみ許可), no-debugger: warn
整形：import/order: warn（グループ間は改行）

厳しさ（Severity）

原則 warn。開発速度を優先し、重大なもの（ビルド阻害・セキュリティ起因）以外は警告止まり。

開発コマンド

Lint: npm run lint / 自動修正: npm run format

### コードフォーマット
- Prettierを導入し、ESLintと統合
- `.prettierrc` に共通ルールを定義
- VS Code設定 (`.vscode/settings.json`) で保存時に自動整形
- 競合ルールは `eslint-config-prettier` で無効化

### フロントエンド環境
- Next.js 15.5.6 / React 19.1.0 / TypeScript ~5.6.3
- ESLint（Flat Config形式）でコード品質を統一
  - TypeScript / React / Next.js に対応
  - console・debugger・import順など軽めのルールのみ適用
- バージョン固定方針：
  - メジャー・マイナーは固定、patchのみ更新許可
  - Node.js 20.18.0（LTS）を nvm で管理

## 今後
- APIとNext.js接続を確認
- 認証（devise-token-auth）導入
- テスト自動化（GitHub Actions予定）