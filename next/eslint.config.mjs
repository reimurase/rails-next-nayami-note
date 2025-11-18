import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import next from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import jest from "eslint-plugin-jest";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";

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
      prettier: prettierPlugin,
    },
    rules: {
      "no-undef": "off",
      "no-debugger": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "import/order": ["warn", { "newlines-between": "always" }],
      // React Hooks の recommended
      ...reactHooks.configs.recommended.rules,

      // Next.js の core-web-vitals
      ...next.configs["core-web-vitals"].rules,

      // Prettier との競合をオフ + Prettier実行をlintに統合
      ...prettierConfig.rules,
      "prettier/prettier": "warn",
    },
  },

  // ★ Jest 用 recommended
  {
    files: [
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
      "**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
    ...jest.configs["flat/recommended"],
  },

  // ★ Testing Library (React) 用
  {
    files: [
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
      "**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
    ...testingLibrary.configs["flat/react"],
  },

  // ★ jest-dom 用
  {
    files: [
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
      "**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
    ...jestDom.configs["flat/recommended"],
  },
];
