// src/components/auth/AuthForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthForm } from "./AuthForm";

import { authApi } from "@/lib/api/auth";

// router.replace を監視できるようにする
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => ({ get: () => "/concerns" }),
}));

// authApi をモックできるようにする
jest.mock("@/lib/api/auth", () => ({
  authApi: {
    signup: jest.fn(),
    login: jest.fn(),
  },
}));

describe("AuthForm", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    jest.clearAllMocks();
  });

  test("サインアップページが表示される", () => {
    render(<AuthForm mode="signup" />);
    expect(screen.getByRole("heading", { name: "Signup" })).toBeInTheDocument();
  });

  test("サインアップ成功後、/concernsに遷移する", async () => {
    const user = userEvent.setup();

    // signup を成功させる
    (authApi.signup as jest.Mock).mockResolvedValueOnce({});

    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.type(screen.getByLabelText("Password confirmation"), "password");

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(authApi.signup).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
      password_confirmation: "password",
    });
    expect(replaceMock).toHaveBeenCalledWith("/concerns");
  });

  test("ログインが失敗後、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();

    // login を失敗させる（401想定）
    (authApi.login as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { error: "Unauthorized" },
      },
    });

    render(<AuthForm mode="login" />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");

    await user.click(screen.getByRole("button", { name: "Login" }));

    // エラーメッセージが表示される
    expect(await screen.findByRole("alert")).toHaveTextContent("Unauthorized");

    // 失敗時は遷移しない
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
