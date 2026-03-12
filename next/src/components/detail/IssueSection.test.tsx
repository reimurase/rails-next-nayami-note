// src/components/detail/IssueSection.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";

import IssueSection from "./IssueSection";

describe("IssueSection", () => {
  test("編集を押すと編集モードに切り替わる", () => {
    render(
      <IssueSection
        concernId={1}
        issue={{ id: 10, title: "旧タイトル", content: "旧内容", concernId: 1 }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("旧タイトル")).toBeInTheDocument();
    expect(screen.getByDisplayValue("旧内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });
});
