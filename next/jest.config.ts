import nextJest from "next/jest";
import type { Config } from "jest";

// Next.jsのルートディレクトリを指定
const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // パスエイリアスを使っている場合
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  coverageProvider: "v8",
};

export default createJestConfig(config);
