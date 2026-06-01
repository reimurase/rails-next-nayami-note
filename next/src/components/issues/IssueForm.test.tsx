// src/components/issues/IssueForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import IssueForm from "./IssueForm";

import { issueApi } from "@/lib/api/issue";

jest.mock("@/lib/api/issue", () => ({
  issueApi: {
    create: jest.fn(),
  },
}));
const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

describe("IssueForm API 呼び出し", () => {
  beforeEach(() => {
    mockedIssueApi.create.mockReset();
  });

  test("フォーム送信で IssueApi.create が呼ばれること", async () => {
    // API成功時のレスポンスをモック
    mockedIssueApi.create.mockResolvedValue({} as any);

    const mockOnCreated = jest.fn();
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    // タイトルを入力
    fireEvent.change(screen.getByLabelText("タイトル（任意）"), {
      target: { value: "テストのタイトル" },
    });

    // 問題を入力
    fireEvent.change(screen.getByLabelText("問題（必須）"), {
      target: { value: "テストの問題" },
    });

    // 送信クリック
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // IssueApi.create が呼ばれるまで待つ
    await waitFor(() => {
      expect(mockedIssueApi.create).toHaveBeenCalledTimes(1);
    });
    expect(mockedIssueApi.create).toHaveBeenCalledWith(1, {
      title: "テストのタイトル",
      content: "テストの問題",
    });
  });
});

describe("IssueForm 異常系", () => {
  beforeEach(() => {
    mockedIssueApi.create.mockReset();
  });

  test("初期状態では必須エラーが表示されないこと", () => {
    const mockOnCreated = jest.fn();
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    expect(screen.queryByText("問題は必須です")).not.toBeInTheDocument();
  });

  test("問題が空のまま追加を押すと必須エラーが表示され、IssueApi.create は呼ばれないこと", async () => {
    mockedIssueApi.create.mockResolvedValue({} as any);

    const mockOnCreated = jest.fn();
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    // 送信クリック（問題未入力）
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(await screen.findByText("問題は必須です")).toBeInTheDocument();
    expect(mockedIssueApi.create).not.toHaveBeenCalled();
  });

  test("問題が1001文字だと文字数エラーが表示され、送信できないこと", () => {
    const mockOnCreated = jest.fn();
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    const longText = "a".repeat(1001);

    fireEvent.change(screen.getByLabelText("問題（必須）"), {
      target: { value: longText },
    });

    expect(screen.getByText("問題は1000文字以内です")).toBeInTheDocument();

    // 超過中はボタンが押せない（disabled）
    expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
  });

  test("タイトルが121文字だと文字数エラーが表示され、送信できないこと", () => {
    const mockOnCreated = jest.fn();
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    const longText = "a".repeat(121);

    fireEvent.change(screen.getByLabelText("タイトル（任意）"), {
      target: { value: longText },
    });

    fireEvent.change(screen.getByLabelText("問題（必須）"), {
      target: { value: "問題" },
    });

    expect(screen.getByText("タイトルは120文字以内です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
  });

  test("バリデーションで送信されない場合、送信中状態にならないこと", async () => {
    const mockOnCreated = jest.fn();
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    fireEvent.click(screen.getByRole("button", { name: "追加" })); // content未入力

    expect(await screen.findByText("問題は必須です")).toBeInTheDocument();

    // 送信中になってない（追加中...にならない / disabledになり続けない）
    expect(screen.getByRole("button", { name: "追加" })).toBeEnabled();
  });

  test("APIが失敗したらエラーが表示され、送信中状態が解除されること", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedIssueApi.create.mockRejectedValueOnce(new Error("API error"));

    const mockOnCreated = jest.fn();
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    fireEvent.change(screen.getByLabelText("タイトル（任意）"), {
      target: { value: "テストのタイトル" },
    });
    fireEvent.change(screen.getByLabelText("問題（必須）"), {
      target: { value: "テストの問題" },
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

    mockedIssueApi.create.mockRejectedValueOnce({
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
    render(<IssueForm concernId={1} onCreated={mockOnCreated} />);

    // フロントの必須チェックは通し、サーバーの422表示だけを検証する
    fireEvent.change(screen.getByLabelText("タイトル（任意）"), {
      target: { value: "テストのタイトル" },
    });
    fireEvent.change(screen.getByLabelText("問題（必須）"), {
      target: { value: "テストの問題" },
    });

    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // serverErrors が表示される（mapIssueServerErrors が効いている証拠）
    expect(await screen.findByText("問題は必須です")).toBeInTheDocument();

    // 成功時コールバックは呼ばれない
    expect(mockOnCreated).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
