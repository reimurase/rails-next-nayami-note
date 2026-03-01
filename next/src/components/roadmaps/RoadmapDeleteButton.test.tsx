// src/components/roadmaps/RoadmapDeleteButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import RoadmapDeleteButton from "./RoadmapDeleteButton";

import { roadmapApi } from "@/lib/roadmapApi";

jest.mock("@/lib/roadmapApi", () => ({
  roadmapApi: {
    remove: jest.fn(),
  },
}));
const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

describe("RoadmapDeleteButton 正常系", () => {
  beforeEach(() => {
    // window.confirm をモック（JSDOMでは実装されていないため）
    window.confirm = jest.fn().mockReturnValue(true);
  });

  test("削除ボタンをクリックすると削除APIが呼ばれ、onDeletedも呼ばれる", async () => {
    mockedRoadmapApi.remove.mockResolvedValue({} as any);

    const onDeletedMock = jest.fn();

    render(<RoadmapDeleteButton id={1} onDeleted={onDeletedMock} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // confirm が呼ばれる
    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    // RoadmapApi.delete が呼ばれる
    await waitFor(() => {
      expect(mockedRoadmapApi.remove).toHaveBeenCalledWith({ id: 1 });
    });

    // APIが終わって onDeleted が呼ばれる
    await waitFor(() => {
      expect(onDeletedMock).toHaveBeenCalled();
    });
  });

  test("削除中はボタンが '削除中...' に変わる", async () => {
    mockedRoadmapApi.remove.mockResolvedValue({} as any);
    window.confirm = jest.fn().mockReturnValue(true);

    render(<RoadmapDeleteButton id={1} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // 削除中表示になる
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("削除中...");
    });

    // 削除が終わるまで待つ
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("削除");
    });
  });
});

describe("RoadmapDeleteButton 異常系", () => {
  test("削除が失敗したらエラーが表示され、onDeleted は呼ばれず、ボタンは元に戻る", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedRoadmapApi.remove.mockRejectedValueOnce(new Error("remove failed"));

    const onDeletedMock = jest.fn();
    render(<RoadmapDeleteButton id={1} onDeleted={onDeletedMock} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // エラー表示
    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    // onDeleted は呼ばれない
    expect(onDeletedMock).not.toHaveBeenCalled();

    // ボタンが元に戻る（削除中...解除）
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "削除" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
