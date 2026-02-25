// src/components/issues/IssueRow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import IssueRow from "./IssueRow";

import { issueApi } from "@/lib/issueApi";

jest.mock("@/lib/issueApi", () => ({
  issueApi: {
    update: jest.fn(),
  },
}));
const mockedIssueApi = issueApi as jest.Mocked<typeof issueApi>;

describe("IssueRow 正常系", () => {
  beforeEach(() => {
    mockedIssueApi.update.mockReset();
  });
  test("編集して保存すると update が呼ばれ、onChanged も呼ばれる", async () => {
    // 1. props を準備
    const issue = { id: 1, title: "もとのタイトル", content: "もとの問題" };
    const onChanged = jest.fn();

    // 2. update のモック成功レスポンス
    mockedIssueApi.update.mockResolvedValue({} as any);

    // 3. 描画
    render(<IssueRow issue={issue} onChanged={onChanged} />);

    // --- 通常モードの表示がある ---
    expect(screen.getByText("もとのタイトル")).toBeInTheDocument();
    expect(screen.getByText("もとの問題")).toBeInTheDocument();

    // 4. 編集ボタンを押す
    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    // 5. input と保存ボタンが表示される
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);

    const [titleInput, contentInput] = inputs;

    // タイトルを変更
    fireEvent.change(titleInput, { target: { value: "更新後のタイトル" } });
    expect(titleInput).toHaveValue("更新後のタイトル");

    // 問題を変更
    fireEvent.change(contentInput, { target: { value: "更新後の問題" } });
    expect(contentInput).toHaveValue("更新後の問題");

    // 6. 保存をクリック
    const saveButton = screen.getByRole("button", { name: "保存" });
    fireEvent.click(saveButton);

    // 7. update が正しい引数で呼ばれたか
    await waitFor(() => {
      expect(mockedIssueApi.update).toHaveBeenCalledWith({
        id: 1,
        title: "更新後のタイトル",
        content: "更新後の問題",
      });
    });

    // 8. 親からもらった onChanged が呼ばれたか
    expect(onChanged).toHaveBeenCalled();

    // 9. 保存後は「編集モードが閉じている」ことだけ確認する
    await waitFor(() => {
      // input が消えている（＝通常モードに戻った）
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });
});
