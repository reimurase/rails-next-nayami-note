// src/components/AuthForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthForm } from "./AuthForm";

import { authApi } from "@/lib/authApi";

// 1) router.push を監視できるようにする
const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// 2) authApi をモックできるようにする（中身はテスト内で差し替える）
jest.mock("@/lib/authApi", () => ({
  authApi: {
    signup: jest.fn(),
    login: jest.fn(),
  },
}));

describe("AuthForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    jest.clearAllMocks();
  });

  it("renders signup form", () => {
    render(<AuthForm mode="signup" />);
    expect(screen.getByRole("heading", { name: "Signup" })).toBeInTheDocument();
  });

  it("signup success: redirects to /concerns", async () => {
    const user = userEvent.setup();

    // signup を成功させる
    (authApi.signup as jest.Mock).mockResolvedValueOnce({});

    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password");

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(authApi.signup).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
    expect(pushMock).toHaveBeenCalledWith("/concerns");
  });

  it("login failure: shows error message", async () => {
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
    expect(pushMock).not.toHaveBeenCalled();
  });
});
