// src/components/auth/ResetRequestForm.test.tsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ResetRequestForm } from "./ResetRequestForm";

import { passwordApi } from "@/lib/api/auth";

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  isAxiosError: (error: any) => error?.isAxiosError === true,
}));

jest.mock("@/lib/api/auth", () => ({
  passwordApi: {
    resetRequest: jest.fn(),
  },
}));

const mockedPasswordApi = passwordApi as jest.Mocked<typeof passwordApi>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ResetRequestForm 異常系", () => {
  test("ネットワークエラーが発生するとエラーメッセージが表示される", async () => {
    mockedPasswordApi.resetRequest.mockRejectedValueOnce({
      isAxiosError: true,
      response: undefined,
    });

    const user = userEvent.setup();
    render(<ResetRequestForm />);
    await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
    await user.click(screen.getByRole("button", { name: "送信する" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
