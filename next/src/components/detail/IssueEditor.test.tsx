// src/components/detail/IssueEditor.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import IssueEditor from "./IssueEditor";

import { issueApi } from "@/lib/api/issue";

jest.mock("@/lib/api/issue", () => ({
  issueApi: {
    update: jest.fn(),
  },
}));

const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

describe("IssueEditor", () => {
  beforeEach(() => {
    mockedIssueApi.update.mockReset();
  });

  test("編集して保存すると update と handleCreated が呼ばれる", async () => {
    mockedIssueApi.update.mockResolvedValue({} as any);
    const handleCreated = jest.fn();
    const handleCancelEdit = jest.fn();

    render(
      <IssueEditor
        concernId={1}
        issue={{ id: 10, title: "旧タイトル", content: "旧内容", concernId: 1 }}
        onSaved={handleCreated}
        onCancel={handleCancelEdit}
      />
    );

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
      expect(handleCreated).toHaveBeenCalled();
    });
  });
});
