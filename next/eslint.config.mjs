// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import next from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default [
  // JavaScriptの基本ルールセット
  js.configs.recommended,

  // 無視するファイル（ビルド成果物など）
  {
    ignores: ["node_modules/", ".next/", "dist/", "out/"],
  },

  // TypeScript/React/Next.js対応
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": ts,
      "@next/next": next,
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    rules: {
      "no-undef": "off",
      "no-debugger": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "import/order": ["warn", { "newlines-between": "always" }],
      ...reactHooks.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },
];
