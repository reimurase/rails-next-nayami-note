// src/components/detail/IssueSection.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import IssueSection from "./IssueSection";

import { issueApi } from "@/lib/api/issue";

jest.mock("@/lib/api/issue", () => ({
  issueApi: {
    update: jest.fn(),
  },
}));

jest.mock("../issues/IssueCreateSheet", () => {
  return function MockIssueCreateSheet() {
    return <div>IssueCreateSheet</div>;
  };
});

const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

describe("IssueSection", () => {
  beforeEach(() => {
    mockedIssueApi.update.mockReset();
  });

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

  test("編集して保存すると update と onIssueDetailChanged が呼ばれる", async () => {
    mockedIssueApi.update.mockResolvedValue({} as any);
    const onIssueDetailChanged = jest.fn();

    render(
      <IssueSection
        concernId={1}
        issue={{ id: 10, title: "旧タイトル", content: "旧内容", concernId: 1 }}
        onIssueDetailChanged={onIssueDetailChanged}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    fireEvent.change(screen.getByDisplayValue("旧タイトル"), {
      target: { value: "新タイトル" },
    });
    fireEvent.change(screen.getByDisplayValue("旧内容"), {
      target: { value: "新内容" },
    });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(mockedIssueApi.update).toHaveBeenCalledWith(1, {
        title: "新タイトル",
        content: "新内容",
      });
    });

    await waitFor(() => {
      expect(onIssueDetailChanged).toHaveBeenCalled();
    });
  });
});
