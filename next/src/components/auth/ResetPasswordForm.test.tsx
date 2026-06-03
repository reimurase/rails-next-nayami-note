// src/components/auth/ResetPasswordForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResetPasswordForm } from "./ResetPasswordForm";

import { passwordApi } from "@/lib/api/auth";

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  isAxiosError: (error: any) => error?.isAxiosError === true,
}));

jest.mock("@/lib/api/auth", () => ({
  passwordApi: {
    reset: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => ({ get: (key: string) => (key === "token" ? "valid-token" : null) }),
}));

const mockedPasswordApi = passwordApi as jest.Mocked<typeof passwordApi>;

beforeEach(() => {
  jest.clearAllMocks();
});

const VALID_PASSWORD = "a".repeat(8);

const fillAndSubmit = async (
  user: ReturnType<typeof userEvent.setup>,
  password: string,
  confirmation: string
) => {
  if (password) await user.type(screen.getByLabelText("新しいパスワード"), password);
  if (confirmation)
    await user.type(screen.getByLabelText("新しいパスワード（確認）"), confirmation);
  await user.click(screen.getByRole("button", { name: "再設定する" }));
};

describe("ResetPasswordForm クライアントバリデーション", () => {
  test("バリデーションエラーがあるときAPIは呼ばれない", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    await user.click(screen.getByRole("button", { name: "再設定する" }));

    expect(mockedPasswordApi.reset).not.toHaveBeenCalled();
  });
});

describe("ResetPasswordForm APIエラー", () => {
  test("APIエラーが発生するとエラーが表示される", async () => {
    mockedPasswordApi.reset.mockRejectedValueOnce({
      isAxiosError: true,
      response: undefined,
    });

    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    await fillAndSubmit(user, VALID_PASSWORD, VALID_PASSWORD);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
