// src/components/issues/IssueIndex.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import IssueIndex from "./IssueIndex";

jest.mock("../detail/ConcernDetailView", () => ({
  __esModule: true,
  default: ({ concernId }: { concernId: number }) => <div>DETAIL:{concernId}</div>,
}));

describe("IssueIndex", () => {
  test("issuesが0件の場合のメッセージ表示が出る", () => {
    render(<IssueIndex issues={[]} />);

    expect(screen.getByText("問題一覧")).toBeInTheDocument();
    expect(screen.getByText("まだ問題はありません")).toBeInTheDocument();
  });

  test("issues が取得できたら一覧を表示する", () => {
    const mockData = [
      { id: 1, title: "タイトルA", content: "問題A", concernId: 1, archivedAt: null },
      { id: 2, title: "タイトルB", content: "問題B", concernId: 2, archivedAt: null },
    ];

    render(<IssueIndex issues={mockData} />);

    expect(screen.getByText("タイトルA")).toBeInTheDocument();
    expect(screen.getByText("タイトルB")).toBeInTheDocument();
    expect(screen.getByText("問題A")).toBeInTheDocument();
    expect(screen.getByText("問題B")).toBeInTheDocument();
  });

  test("行をクリックすると詳細が開く", () => {
    const issues = [
      { id: 1, title: "a", content: "c1", concernId: 1, archivedAt: null },
      { id: 2, title: "b", content: "c2", concernId: 2, archivedAt: null },
    ];

    render(<IssueIndex issues={issues} />);

    fireEvent.click(screen.getByText("c1"));
    expect(screen.getByText("DETAIL:1")).toBeInTheDocument();
  });

  test("ESCで詳細が閉じる", () => {
    const issues = [{ id: 1, title: "a", content: "c1", concernId: 1, archivedAt: null }];
    render(<IssueIndex issues={issues} />);

    fireEvent.click(screen.getByText("c1"));

    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByText("DETAIL:1")).not.toBeInTheDocument();
  });
});
