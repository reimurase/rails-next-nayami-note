// src/components/roadmaps/RoadmapRow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import RoadmapRow from "./RoadmapRow";

import { roadmapApi } from "@/lib/roadmapApi";

jest.mock("@/lib/roadmapApi", () => ({
  roadmapApi: {
    update: jest.fn(),
  },
}));
const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

describe("RoadmapRow 正常系", () => {
  beforeEach(() => {
    mockedRoadmapApi.update.mockReset();
  });
  test("編集して保存すると update が呼ばれ、onChanged も呼ばれる", async () => {
    // 1. props を準備
    const roadmap = { id: 1, goal: "もとのゴール", content: "もとのロードマップ" };
    const onChanged = jest.fn();

    // 2. update のモック成功レスポンス
    mockedRoadmapApi.update.mockResolvedValue({} as any);

    // 3. 描画
    render(<RoadmapRow roadmap={roadmap} onChanged={onChanged} />);

    // --- 通常モードの表示がある ---
    expect(screen.getByText("もとのゴール")).toBeInTheDocument();
    expect(screen.getByText("もとのロードマップ")).toBeInTheDocument();

    // 4. 編集ボタンを押す
    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    // 5. input と保存ボタンが表示される
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);

    const [goalInput, contentInput] = inputs;

    // ゴールを変更
    fireEvent.change(goalInput, { target: { value: "更新後のゴール" } });
    expect(goalInput).toHaveValue("更新後のゴール");

    // ロードマップを変更
    fireEvent.change(contentInput, { target: { value: "更新後のロードマップ" } });
    expect(contentInput).toHaveValue("更新後のロードマップ");

    // 6. 保存をクリック
    const saveButton = screen.getByRole("button", { name: "保存" });
    fireEvent.click(saveButton);

    // 7. update が正しい引数で呼ばれたか
    await waitFor(() => {
      expect(mockedRoadmapApi.update).toHaveBeenCalledWith({
        id: 1,
        goal: "更新後のゴール",
        content: "更新後のロードマップ",
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
