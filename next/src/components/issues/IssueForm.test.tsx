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
    fireEvent.change(screen.getByPlaceholderText("タイトル（任意）"), {
      target: { value: "テストのタイトル" },
    });

    // 問題を入力
    fireEvent.change(screen.getByPlaceholderText("問題（任意）"), {
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
