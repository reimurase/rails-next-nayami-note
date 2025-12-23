// src/components/concerns/ConcernRow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ConcernRow from "./ConcernRow";

import { concernApi } from "@/lib/concernApi";

jest.mock("@/lib/concernApi", () => ({
  concernApi: {
    update: jest.fn(),
  },
}));
const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

describe("ConcernRow 正常系", () => {
  beforeEach(() => {
    mockedConcernApi.update.mockReset();
  });
  test("編集して保存すると update が呼ばれ、onChanged も呼ばれる", async () => {
    // 1. props を準備
    const concern = { id: 1, trigger_event: "もとのきっかけ", content: "もとの内容" };
    const onChanged = jest.fn();

    // 2. update のモック成功レスポンス
    mockedConcernApi.update.mockResolvedValue({} as any);

    // 3. 描画
    render(<ConcernRow concern={concern} onChanged={onChanged} />);

    // --- 通常モードの表示がある ---
    expect(screen.getByText("もとのきっかけ")).toBeInTheDocument();
    expect(screen.getByText("もとの内容")).toBeInTheDocument();

    // 4. 編集ボタンを押す
    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    // 5. input と保存ボタンが表示される
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);

    const [triggerInput, contentInput] = inputs;

    // きっかけを変更
    fireEvent.change(triggerInput, { target: { value: "更新後のきっかけ" } });
    expect(triggerInput).toHaveValue("更新後のきっかけ");

    // 内容を変更
    fireEvent.change(contentInput, { target: { value: "更新後の内容" } });
    expect(contentInput).toHaveValue("更新後の内容");

    // 6. 保存をクリック
    const saveButton = screen.getByRole("button", { name: "保存" });
    fireEvent.click(saveButton);

    // 7. update が正しい引数で呼ばれたか
    await waitFor(() => {
      expect(mockedConcernApi.update).toHaveBeenCalledWith({
        id: 1,
        triggerEvent: "更新後のきっかけ",
        content: "更新後の内容",
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

describe("ConcernRow 異常系", () => {
  beforeEach(() => {
    mockedConcernApi.update.mockReset();
  });
  test("content を空にして保存すると必須エラーが出て update は呼ばれない", async () => {
    const concern = { id: 1, trigger_event: "もとのきっかけ", content: "もとの内容" };
    const onChanged = jest.fn();

    mockedConcernApi.update.mockResolvedValue({} as any);

    render(<ConcernRow concern={concern} onChanged={onChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    // content を空にする
    fireEvent.change(contentInput, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    // 必須エラーが出る
    expect(await screen.findByText("なやみは必須です")).toBeInTheDocument();

    // update は呼ばれない
    expect(mockedConcernApi.update).not.toHaveBeenCalled();
    expect(onChanged).not.toHaveBeenCalled();
  });

  test("content が1001文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const concern = { id: 1, trigger_event: "もとのきっかけ", content: "もとの内容" };
    const onChanged = jest.fn();

    render(<ConcernRow concern={concern} onChanged={onChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    const longText = "a".repeat(1001);
    fireEvent.change(contentInput, { target: { value: longText } });

    expect(screen.getByText("なやみは1000文字以内です")).toBeInTheDocument();

    // 超過中は保存が disabled（今回仕様）
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("trigger_event が121文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const concern = { id: 1, trigger_event: "もとのきっかけ", content: "もとの内容" };
    const onChanged = jest.fn();

    render(<ConcernRow concern={concern} onChanged={onChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    const inputs = screen.getAllByRole("textbox");
    const [triggerInput] = inputs;

    const longText = "a".repeat(121);
    fireEvent.change(triggerInput, { target: { value: longText } });

    expect(screen.getByText("きっかけは120文字以内です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("更新が失敗したらエラーが表示され、編集モードのままで onChanged は呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const concern = { id: 1, trigger_event: "もとのきっかけ", content: "もとの内容" };
    const onChanged = jest.fn();

    mockedConcernApi.update.mockRejectedValueOnce(new Error("update failed"));

    render(<ConcernRow concern={concern} onChanged={onChanged} />);

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;
    fireEvent.change(contentInput, { target: { value: "更新後の内容" } });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("更新に失敗しました");

    expect(screen.getAllByRole("textbox")).toHaveLength(2);

    expect(onChanged).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "保存" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
