// src/components/detail/IssueSection.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";

import IssueSection from "./IssueSection";

jest.mock("../issues/IssueForm", () => () => <div data-testid="issue-form" />);

describe("IssueSection", () => {
  test("新規作成を押すとIssueFormが表示される", () => {
    render(<IssueSection concernId={1} issue={null} />);

    fireEvent.click(screen.getByRole("button", { name: "新規作成" }));

    expect(screen.getByTestId("issue-form")).toBeInTheDocument();
  });

  test("編集を押すと編集モードに切り替わる", () => {
    render(
      <IssueSection
        concernId={1}
        issue={{ id: 10, title: "旧タイトル", content: "旧内容", concernId: 1, archivedAt: null }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("旧タイトル")).toBeInTheDocument();
    expect(screen.getByDisplayValue("旧内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });
});
