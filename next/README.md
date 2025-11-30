## 開発環境メモ
- バージョン固定方針：
  - メジャー・マイナーは固定、patchのみ更新許可
  - Node.js 20.18.0（LTS）を nvm で管理

- Node.js: 20.18.0 (LTS)
- Next.js: 15.5.6
- React: 19.1.0
- TypeScript: ~5.6.3
- ESlint (flat config): 9.38.0
- @typescript-eslint: 8.46.2

TypeScript 構成
App Router 構成（app/ ディレクトリ）
src/ ディレクトリを採用して、責務を明確化
.gitignore を更新（ビルド成果物や環境依存ファイルを除外）
tsconfig.json に @/* エイリアスを設定し、モジュールの可読性を向上

## 開発メモ
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

### MUI
- Robotoフォントを採用
- 現状、muiのUI部品はrobotoに、それ以外はGeistになる
- ThemeProviderはクライアントコンポーネントなのでサーバーコンポーネント内に書けない。なので、MuiProvider.tsxに分ける
- サーバー側で生成したcssとクライアント側で再描画するcssを同じにするためmaterial-nextjsを導入
- cssの使い分けのルール
  - 現状「MUIのsxプロパティ」、「emotionのcssメソッド」が存在する
  - 原則、sxプロパティでスタイル定義を行う。
  - 複数の React コンポーネントで共通利用することが想定される一部スタイルのみ、emotionを利用する。

### rails-next疎通確認
- axios, swrを利用して、railsから情報を取得

## 劣後メモ
- 機能に応じたページの区分け
- コンポーネントの名前
- UIをわかりやすい形にする
- MUIを使う
- URLの短縮
- フォームなどをコンポーネント化
- エラーメッセージの表示
- if文のリファクタリング
