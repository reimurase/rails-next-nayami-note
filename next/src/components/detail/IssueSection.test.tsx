// src/components/detail/IssueSection.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import IssueSection from "./IssueSection";

import { issueApi } from "@/lib/api/issue";
import type { Issue } from "@/types/issue";

jest.mock("../issues/IssueForm", () => () => <div data-testid="issue-form" />);

jest.mock("@/lib/api/issue", () => ({
  issueApi: {
    remove: jest.fn(),
    archiveIssue: jest.fn(),
    unarchiveIssue: jest.fn(),
  },
}));
const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

const baseIssue: Issue = {
  id: 1,
  title: "テストのタイトル",
  content: "テストの内容",
  concernId: 10,
  archivedAt: null,
};

describe("IssueSection", () => {
  beforeEach(() => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedIssueApi.remove.mockReset();
    mockedIssueApi.archiveIssue.mockReset();
    mockedIssueApi.unarchiveIssue.mockReset();
  });

  test("新規作成を押すとIssueFormが表示される", () => {
    render(<IssueSection concernId={10} issue={null} />);

    fireEvent.click(screen.getByRole("button", { name: "新規作成" }));

    expect(screen.getByTestId("issue-form")).toBeInTheDocument();
  });

  test("編集を押すと編集モードに切り替わる", () => {
    render(
      <IssueSection
        concernId={10}
        issue={{ id: 1, title: "旧タイトル", content: "旧内容", concernId: 10, archivedAt: null }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("旧タイトル")).toBeInTheDocument();
    expect(screen.getByDisplayValue("旧内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });

  test("削除するとAPIが呼ばれ、onIssueChangedも呼ばれる", async () => {
    mockedIssueApi.remove.mockResolvedValue({} as any);
    const onIssueChanged = jest.fn();

    render(<IssueSection concernId={10} issue={baseIssue} onIssueChanged={onIssueChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    await waitFor(() => {
      expect(mockedIssueApi.remove).toHaveBeenCalledWith(10);
    });
    await waitFor(() => {
      expect(onIssueChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みでない場合、ライブラリへ移動APIが呼ばれる", async () => {
    mockedIssueApi.archiveIssue.mockResolvedValue({} as any);
    const onIssueChanged = jest.fn();

    render(<IssueSection concernId={10} issue={baseIssue} onIssueChanged={onIssueChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    await waitFor(() => {
      expect(mockedIssueApi.archiveIssue).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onIssueChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みの場合、ノートへ戻すAPIが呼ばれる", async () => {
    mockedIssueApi.unarchiveIssue.mockResolvedValue({} as any);
    const archivedIssue: Issue = { ...baseIssue, archivedAt: "2024-01-02T00:00:00Z" };

    render(<IssueSection concernId={10} issue={archivedIssue} />);

    fireEvent.click(screen.getByRole("button", { name: "ノートへ戻す" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にノートへ戻しますか？");

    await waitFor(() => {
      expect(mockedIssueApi.unarchiveIssue).toHaveBeenCalledWith(1);
    });
  });

  test("削除が失敗したらエラーが表示され、onIssueChangedは呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedIssueApi.remove.mockRejectedValueOnce(new Error("remove failed"));
    const onIssueChanged = jest.fn();

    render(<IssueSection concernId={10} issue={baseIssue} onIssueChanged={onIssueChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    expect(onIssueChanged).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
