// src/components/AppHeader.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppHeader } from "./AppHeader";

import type { Me } from "@/types/auth";

// ---- mocks ----
const replaceMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

jest.mock("next/link", () => {
  return function Link(props: any) {
    const { href, children, ...rest } = props;
    return (
      <a href={typeof href === "string" ? href : String(href)} {...rest}>
        {children}
      </a>
    );
  };
});

const mockMe: { data: Me | undefined } = { data: undefined };
const mutateMock = jest.fn();

jest.mock("swr", () => ({
  __esModule: true,
  default: () => mockMe,
  mutate: (...args: any[]) => mutateMock(...args),
}));

const logoutMock = jest.fn();
jest.mock("@/lib/api/auth", () => ({
  authApi: {
    logout: () => logoutMock(),
  },
}));

const clearCsrfTokenCacheMock = jest.fn();
jest.mock("@/lib/api/csrf", () => ({
  clearCsrfTokenCache: () => clearCsrfTokenCacheMock(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AppHeader", () => {
  describe("未ログイン時", () => {
    beforeEach(() => {
      mockMe.data = undefined;
    });

    it("サインアップ/ログインボタンが描画される", () => {
      render(<AppHeader />);
      expect(screen.getByText("ログイン")).toBeInTheDocument();
      expect(screen.getByText("サインアップ")).toBeInTheDocument();
    });

    it("ハンバーガーメニューが表示されない", () => {
      render(<AppHeader />);
      expect(screen.queryByLabelText("メニューを開閉")).not.toBeInTheDocument();
    });
  });

  describe("ログイン時", () => {
    beforeEach(() => {
      mockMe.data = { id: 1, email: "test@example.com", autoArchiveEnabled: false };
    });

    it("ログアウトボタンが表示される", () => {
      render(<AppHeader />);
      expect(screen.getByText("ログアウト")).toBeInTheDocument();
    });

    it("ハンバーガーメニューが表示される", () => {
      render(<AppHeader />);
      expect(screen.getByLabelText("メニューを開閉")).toBeInTheDocument();
    });
  });

  test("ログアウトが成功した場合：logout、meのキャッシュをクリア、csrfキャッシュをクリア、そしてリダイレクトが実行される", async () => {
    logoutMock.mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    render(<AppHeader />);

    await user.click(screen.getByRole("button", { name: "ログアウト" }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(clearCsrfTokenCacheMock).toHaveBeenCalledTimes(1);
      expect(mutateMock).toHaveBeenCalledWith("me", undefined, false);
      expect(replaceMock).toHaveBeenCalledWith("/");
    });
  });
});
