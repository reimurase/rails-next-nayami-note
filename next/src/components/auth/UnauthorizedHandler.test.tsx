// src/components/auth/UnauthorizedHandler.test.tsx
import React from "react";
import { render, act } from "@testing-library/react";
import { mutate } from "swr";

import { UnauthorizedHandler } from "./UnauthorizedHandler";

jest.mock("swr", () => ({ mutate: jest.fn() }));

let mockPathname: string | null = "/concerns";
const replaceMock = jest.fn();
let unauthorizedCb: (() => void) | null = null;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => mockPathname,
}));

jest.mock("@/lib/api/onUnauthorized", () => ({
  setOnUnauthorized: jest.fn((cb: any) => {
    unauthorizedCb = cb;
  }),
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockPathname = "/concerns";
  unauthorizedCb = null;
});

afterEach(() => {
  jest.useRealTimers();
});

test("unauthorized 発火で me を落として /login?next=... に遷移する", () => {
  render(<UnauthorizedHandler />);

  act(() => {
    unauthorizedCb!();
  });

  expect(mutate).toHaveBeenCalledWith("me", undefined, false);
  expect(replaceMock).toHaveBeenCalledWith("/login?next=%2Fconcerns");
});

test("pathname が /login のときは next を付けない（ループ回避）", () => {
  mockPathname = "/login";
  render(<UnauthorizedHandler />);

  act(() => {
    unauthorizedCb!();
  });

  expect(replaceMock).toHaveBeenCalledWith("/login");
});
