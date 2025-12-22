// src/components/concerns/ConcernForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ConcernForm from "./ConcernForm";

import { concernApi } from "@/lib/concernApi";

jest.mock("@/lib/concernApi", () => ({
  concernApi: {
    create: jest.fn(),
  },
}));
const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

describe("ConcernForm API 呼び出し", () => {
  beforeEach(() => {
    mockedConcernApi.create.mockReset();
  });

  test("フォーム送信で ConcernApi.create が呼ばれること", async () => {
    // API成功時のレスポンスをモック
    mockedConcernApi.create.mockResolvedValue({} as any);

    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    // きっかけを入力
    fireEvent.change(screen.getByPlaceholderText("何があって、どう思ったんだろう。（任意）"), {
      target: { value: "テストのきっかけ" },
    });

    // なやみを入力
    fireEvent.change(screen.getByPlaceholderText("とりあえず、今のなやみを書いてみよう（必須）"), {
      target: { value: "テストのなやみ" },
    });

    // 送信クリック
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // ConcernApi.create が呼ばれるまで待つ
    await waitFor(() => {
      expect(mockedConcernApi.create).toHaveBeenCalledTimes(1);
    });
    expect(mockedConcernApi.create).toHaveBeenCalledWith({
      triggerEvent: "テストのきっかけ",
      content: "テストのなやみ",
    });
  });

  test("初期状態では必須エラーが表示されないこと", () => {
    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    expect(screen.queryByText("なやみは必須です")).not.toBeInTheDocument();
  });

  test("なやみが空のまま追加を押すと必須エラーが表示され、ConcernApi.create は呼ばれないこと", async () => {
    mockedConcernApi.create.mockResolvedValue({} as any);

    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    // 送信クリック（なやみ未入力）
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(await screen.findByText("なやみは必須です")).toBeInTheDocument();
    expect(mockedConcernApi.create).not.toHaveBeenCalled();
  });

  test("なやみが1001文字だと文字数エラーが表示され、送信できないこと", () => {
    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    const longText = "a".repeat(1001);

    fireEvent.change(screen.getByPlaceholderText("とりあえず、今のなやみを書いてみよう（必須）"), {
      target: { value: longText },
    });

    expect(screen.getByText("なやみは1000文字以内です")).toBeInTheDocument();

    // 超過中はボタンが押せない（disabled）
    expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
  });

  test("きっかけが121文字だと文字数エラーが表示され、送信できないこと", () => {
    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    const longText = "a".repeat(121);

    fireEvent.change(screen.getByPlaceholderText("何があって、どう思ったんだろう。（任意）"), {
      target: { value: longText },
    });

    fireEvent.change(screen.getByPlaceholderText("とりあえず、今のなやみを書いてみよう（必須）"), {
      target: { value: "なやみ" },
    });

    expect(screen.getByText("きっかけは120文字以内です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
  });
});
