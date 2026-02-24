// src/components/issues/IssueIndex.test.tsx
import { render, screen } from "@testing-library/react";

import IssueIndex from "./IssueIndex";

describe("IssueIndex", () => {
  test("issuesが0件の場合のメッセージ表示が出る", () => {
    render(<IssueIndex issues={[]} />);

    expect(screen.getByText("問題一覧")).toBeInTheDocument();
    expect(screen.getByText("まだ問題はありません")).toBeInTheDocument();
  });

  test("issues が取得できたら一覧を表示する", () => {
    const mockData = [
      { id: 1, title: "タイトルA", content: "問題A" },
      { id: 2, title: "タイトルB", content: "問題B" },
    ];

    render(<IssueIndex issues={mockData} />);

    expect(screen.getByText("タイトルA")).toBeInTheDocument();
    expect(screen.getByText("タイトルB")).toBeInTheDocument();
    expect(screen.getByText("問題A")).toBeInTheDocument();
    expect(screen.getByText("問題B")).toBeInTheDocument();
  });
});
