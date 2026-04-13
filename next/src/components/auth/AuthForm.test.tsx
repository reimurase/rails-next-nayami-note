// src/components/auth/AuthForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthForm } from "./AuthForm";

import { authApi } from "@/lib/api/auth";
import { LOGIN_CREDENTIAL_ERROR } from "@/lib/validations/authValidation";

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => ({ get: () => "/concerns" }),
}));

jest.mock("@/lib/api/csrf", () => ({
  clearCsrfTokenCache: jest.fn(),
}));

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  isAxiosError: (error: any) => error?.isAxiosError === true,
}));

jest.mock("@/lib/api/auth", () => ({
  authApi: {
    signup: jest.fn(),
    login: jest.fn(),
    guestLogin: jest.fn(),
  },
}));

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

type SignupFields = {
  email?: string;
  password?: string;
  passwordConfirmation?: string;
};

const setupSignupForm = async (fields: SignupFields) => {
  const user = userEvent.setup();
  render(<AuthForm mode="signup" />);

  if (fields.email !== undefined) {
    await user.type(screen.getByLabelText("Email"), fields.email);
  }
  if (fields.password !== undefined) {
    await user.type(screen.getByLabelText("Password"), fields.password);
  }
  if (fields.passwordConfirmation !== undefined) {
    await user.type(screen.getByLabelText("Password confirmation"), fields.passwordConfirmation);
  }

  return user;
};

beforeEach(() => {
  replaceMock.mockClear();
  jest.clearAllMocks();
});

describe("AuthForm 正常系", () => {
  test("サインアップページが表示される", () => {
    render(<AuthForm mode="signup" />);
    expect(screen.getByRole("heading", { name: "Signup" })).toBeInTheDocument();
  });

  test("サインアップ成功後、/concernsに遷移する", async () => {
    mockedAuthApi.signup.mockResolvedValueOnce({} as any);

    const user = await setupSignupForm({
      email: "test@example.com",
      password: "password",
      passwordConfirmation: "password",
    });
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(authApi.signup).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
      password_confirmation: "password",
    });
    expect(replaceMock).toHaveBeenCalledWith("/concerns");
  });
});

describe("AuthForm 異常系", () => {
  test("初期状態では必須エラーが表示されないこと", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.queryByText("メールアドレスは必須です")).not.toBeInTheDocument();
    expect(screen.queryByText("パスワードは必須です")).not.toBeInTheDocument();
    expect(screen.queryByText("パスワード確認は必須です")).not.toBeInTheDocument();
  });

  test("何も入力せずCreate accountを押すと全フィールドの必須エラーが表示され、authApi.signupは呼ばれないこと", async () => {
    const user = await setupSignupForm({});
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("メールアドレスは必須です")).toBeInTheDocument();
    expect(screen.getByText("パスワードは必須です")).toBeInTheDocument();
    expect(screen.getByText("パスワード確認は必須です")).toBeInTheDocument();
    expect(mockedAuthApi.signup).not.toHaveBeenCalled();
  });

  test("メールアドレスが256文字だと文字数エラーが表示され、送信できないこと", async () => {
    const user = await setupSignupForm({
      email: "a".repeat(250) + "@b.com",
      password: "password",
      passwordConfirmation: "password",
    });
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("メールアドレスは255文字以内です")).toBeInTheDocument();
    expect(mockedAuthApi.signup).not.toHaveBeenCalled();
  });

  test("メールアドレスが不正な形式だと形式エラーが表示され、送信できないこと", async () => {
    const user = await setupSignupForm({
      email: "invalid-email",
      password: "password",
      passwordConfirmation: "password",
    });
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("メールアドレスの形式が正しくありません")).toBeInTheDocument();
    expect(mockedAuthApi.signup).not.toHaveBeenCalled();
  });

  test("パスワードが7文字だと文字数エラーが表示され、送信できないこと", async () => {
    const user = await setupSignupForm({
      email: "test@example.com",
      password: "a".repeat(7),
      passwordConfirmation: "a".repeat(7),
    });
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("パスワードは8文字以上です")).toBeInTheDocument();
    expect(mockedAuthApi.signup).not.toHaveBeenCalled();
  });

  test("パスワードとパスワード確認が一致しないとエラーが表示され、送信できないこと", async () => {
    const user = await setupSignupForm({
      email: "test@example.com",
      password: "password",
      passwordConfirmation: "wrong-password",
    });
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("パスワードが一致しません")).toBeInTheDocument();
    expect(mockedAuthApi.signup).not.toHaveBeenCalled();
  });

  test("ログイン失敗（401）後、曖昧なエラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    mockedAuthApi.login.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 401, data: {} },
    });

    render(<AuthForm mode="login" />);
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(LOGIN_CREDENTIAL_ERROR);
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
