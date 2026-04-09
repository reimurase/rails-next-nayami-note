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

  test("編集して保存すると update と handleSaved が呼ばれる", async () => {
    mockedIssueApi.update.mockResolvedValue({} as any);
    const issue = {
      id: 10,
      title: "旧タイトル",
      content: "旧内容",
      concernId: 1,
      archivedAt: null,
    };
    const handleSaved = jest.fn();
    const handleCancel = jest.fn();

    render(
      <IssueEditor concernId={1} issue={issue} onSaved={handleSaved} onCancel={handleCancel} />
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
      expect(handleSaved).toHaveBeenCalled();
    });
  });
});

describe("IssueEditor 異常系", () => {
  beforeEach(() => {
    mockedIssueApi.update.mockReset();
  });
  test("content を空にして保存すると必須エラーが出て update は呼ばれない", async () => {
    const issue = {
      id: 1,
      concernId: 1,
      title: "もとのタイトル",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    mockedIssueApi.update.mockResolvedValue({} as any);

    render(<IssueEditor concernId={1} issue={issue} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    // content を空にする
    fireEvent.change(contentInput, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    // 必須エラーが出る
    expect(await screen.findByText("問題は必須です")).toBeInTheDocument();

    // update は呼ばれない
    expect(mockedIssueApi.update).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  test("content が1001文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const issue = {
      id: 1,
      concernId: 1,
      title: "もとのタイトル",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    render(<IssueEditor concernId={1} issue={issue} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    const longText = "a".repeat(1001);
    fireEvent.change(contentInput, { target: { value: longText } });

    expect(screen.getByText("問題は1000文字以内です")).toBeInTheDocument();

    // 超過中は保存が disabled（今回仕様）
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("title が121文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const issue = {
      id: 1,
      concernId: 1,
      title: "もとのタイトル",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    render(<IssueEditor concernId={1} issue={issue} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [triggerInput] = inputs;

    const longText = "a".repeat(121);
    fireEvent.change(triggerInput, { target: { value: longText } });

    expect(screen.getByText("タイトルは120文字以内です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("更新が失敗したらエラーが表示され、編集モードのままで onSaved は呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const issue = {
      id: 1,
      concernId: 1,
      title: "もとのタイトル",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    mockedIssueApi.update.mockRejectedValueOnce(new Error("update failed"));

    render(<IssueEditor concernId={1} issue={issue} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;
    fireEvent.change(contentInput, { target: { value: "更新後の内容" } });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "更新に失敗しました。時間を置いて再度お試しください。"
    );

    expect(screen.getAllByRole("textbox")).toHaveLength(2);

    expect(onSaved).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "保存" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
