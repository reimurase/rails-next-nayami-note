// src/utils/safeNext.test.ts

import { safeNext } from "./safeNext";

describe("safeNext", () => {
  it("nullならfallbackを返す", () => {
    expect(safeNext(null)).toBe("/concerns");
  });

  it("空文字ならfallbackを返す", () => {
    expect(safeNext("")).toBe("/concerns");
  });

  it("正常な相対パスはそのまま返す", () => {
    expect(safeNext("/dashboard")).toBe("/dashboard");
  });

  it("絶対URLを弾く", () => {
    expect(safeNext("https://evil.com")).toBe("/concerns");
  });

  it("//で始まるURLを弾く", () => {
    expect(safeNext("//evil.com")).toBe("/concerns");
  });

  it("カスタムfallbackが使える", () => {
    expect(safeNext(null, "/home")).toBe("/home");
  });
});
