// src/components/AppHeader.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppHeader } from "./AppHeader";

import { clearCsrfTokenCache } from "@/lib/api/csrf";

// ---- mocks ----
const replaceMock = jest.fn();
const clearCsrfTokenCacheMock = clearCsrfTokenCache as unknown as jest.Mock;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

// next/link はテストでは単なる <a> に落とすのが簡単
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

const mutateMock = jest.fn();
jest.mock("swr", () => ({
  mutate: (...args: any[]) => mutateMock(...args),
}));

const logoutMock = jest.fn();
jest.mock("@/lib/api/auth", () => ({
  authApi: {
    logout: (...args: any[]) => logoutMock(...args),
  },
}));

jest.mock("@/lib/api/csrf", () => ({
  clearCsrfTokenCache: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AppHeader (happy path)", () => {
  test("リンクが描画されること", () => {
    render(<AppHeader />);

    expect(screen.getByRole("link", { name: "なやみノート" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Signup" })).toHaveAttribute("href", "/signup");
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  test("ログアウトが成功した場合：logout、meのキャッシュをクリア、csrfキャッシュをクリア、そしてリダイレクトが実行される", async () => {
    logoutMock.mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    render(<AppHeader />);

    await user.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(clearCsrfTokenCacheMock).toHaveBeenCalledTimes(1);
      expect(mutateMock).toHaveBeenCalledWith("me", undefined, false);
      expect(replaceMock).toHaveBeenCalledWith("/");
    });
  });
});
