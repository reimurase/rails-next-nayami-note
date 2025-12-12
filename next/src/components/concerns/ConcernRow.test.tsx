// src/components/concerns/ConcernRow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";

import ConcernRow from "./ConcernRow";

jest.mock("axios");
const mockedAxios = jest.mocked(axios);

describe("ConcernRow 正常系", () => {
  test("編集して保存すると PATCH が呼ばれ、onChanged も呼ばれる", async () => {
    // 1. props を準備
    const concern = { id: 1, trigger_event: "もとのきっかけ", content: "もとの内容" };
    const onChanged = jest.fn();

    // 2. PATCH のモック成功レスポンス
    mockedAxios.patch.mockResolvedValue({
      data: { id: 1, trigger_event: "更新後のきっかけ", content: "更新後の内容" },
    });

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

    // 7. PATCH が正しい引数で呼ばれたか
    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith("http://localhost:3000/api/v1/concerns/1", {
        concern: { trigger_event: "更新後のきっかけ", content: "更新後の内容" },
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
