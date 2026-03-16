// src/components/concerns/ConcernForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ConcernForm from "./ConcernForm";

import { concernApi } from "@/lib/api/concern";

jest.mock("@/lib/api/concern", () => ({
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
});

describe("ConcernForm 異常系", () => {
  beforeEach(() => {
    mockedConcernApi.create.mockReset();
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

  test("バリデーションで送信されない場合、送信中状態にならないこと", async () => {
    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    fireEvent.click(screen.getByRole("button", { name: "追加" })); // content未入力

    expect(await screen.findByText("なやみは必須です")).toBeInTheDocument();

    // 送信中になってない（追加中...にならない / disabledになり続けない）
    expect(screen.getByRole("button", { name: "追加" })).toBeEnabled();
  });

  test("APIが失敗したらエラーが表示され、送信中状態が解除されること", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedConcernApi.create.mockRejectedValueOnce(new Error("API error"));

    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    fireEvent.change(screen.getByPlaceholderText("何があって、どう思ったんだろう。（任意）"), {
      target: { value: "テストのきっかけ" },
    });
    fireEvent.change(screen.getByPlaceholderText("とりあえず、今のなやみを書いてみよう（必須）"), {
      target: { value: "テストのなやみ" },
    });

    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // エラーが表示される
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "保存に失敗しました。時間を置いて再度お試しください。"
    );

    // 成功時コールバックは呼ばれない
    expect(mockOnCreated).not.toHaveBeenCalled();

    // 送信中表示が消えて、ボタンが通常表示に戻る（＝isSubmitting解除）
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "追加" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });

  test("APIが422を返したらフィールド下にエラーが表示されること", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedConcernApi.create.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          errors: {
            content: [{ code: "blank" }],
          },
        },
      },
    });

    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    // フロントの必須チェックは通し、サーバーの422表示だけを検証する
    fireEvent.change(screen.getByPlaceholderText("何があって、どう思ったんだろう。（任意）"), {
      target: { value: "テストのきっかけ" },
    });
    fireEvent.change(screen.getByPlaceholderText("とりあえず、今のなやみを書いてみよう（必須）"), {
      target: { value: "テストのなやみ" },
    });

    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // serverErrors が表示される（mapConcernServerErrors が効いている証拠）
    expect(await screen.findByText("なやみは必須です")).toBeInTheDocument();

    // 成功時コールバックは呼ばれない
    expect(mockOnCreated).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
