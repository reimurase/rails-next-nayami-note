// src/components/issues/IssueRow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import IssueRow from "./IssueRow";

import { issueApi } from "@/lib/api/issue";
import type { Issue } from "@/types/issue";

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

const openMenu = () => {
  fireEvent.click(screen.getByRole("button", { name: "操作メニュー" }));
};

describe("IssueRow", () => {
  beforeEach(() => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedIssueApi.remove.mockReset();
    mockedIssueApi.archiveIssue.mockReset();
    mockedIssueApi.unarchiveIssue.mockReset();
  });

  test("行をクリックするとonOpenDetailが呼ばれる", () => {
    const onOpenDetail = jest.fn();
    render(<IssueRow issue={baseIssue} onOpenDetail={onOpenDetail} />);

    fireEvent.click(screen.getByText("テストのタイトル"));

    expect(onOpenDetail).toHaveBeenCalledTimes(1);
  });

  test("削除するとAPIが呼ばれ、onIssueListChangedも呼ばれる", async () => {
    mockedIssueApi.remove.mockResolvedValue({} as any);
    const onIssueListChanged = jest.fn();

    render(
      <IssueRow
        issue={baseIssue}
        onOpenDetail={jest.fn()}
        onIssueListChanged={onIssueListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));

    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    await waitFor(() => {
      expect(mockedIssueApi.remove).toHaveBeenCalledWith(10);
    });
    await waitFor(() => {
      expect(onIssueListChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みでない場合、ライブラリへ移動APIが呼ばれる", async () => {
    mockedIssueApi.archiveIssue.mockResolvedValue({} as any);
    const onIssueListChanged = jest.fn();

    render(
      <IssueRow
        issue={baseIssue}
        onOpenDetail={jest.fn()}
        onIssueListChanged={onIssueListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "ライブラリへ" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    await waitFor(() => {
      expect(mockedIssueApi.archiveIssue).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onIssueListChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みの場合、ノートへ戻すAPIが呼ばれる", async () => {
    mockedIssueApi.unarchiveIssue.mockResolvedValue({} as any);
    const archivedIssue: Issue = { ...baseIssue, archivedAt: "2024-01-02T00:00:00Z" };

    render(<IssueRow issue={archivedIssue} onOpenDetail={jest.fn()} />);

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "ノートへ戻す" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にノートへ戻しますか？");

    await waitFor(() => {
      expect(mockedIssueApi.unarchiveIssue).toHaveBeenCalledWith(1);
    });
  });

  test("削除が失敗したらエラーが表示され、onIssueListChangedは呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedIssueApi.remove.mockRejectedValueOnce(new Error("remove failed"));
    const onIssueListChanged = jest.fn();

    render(
      <IssueRow
        issue={baseIssue}
        onOpenDetail={jest.fn()}
        onIssueListChanged={onIssueListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    expect(onIssueListChanged).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
