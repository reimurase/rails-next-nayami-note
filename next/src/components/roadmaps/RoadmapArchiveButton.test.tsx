// src/components/roadmaps/RoadmapArchiveButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";

import RoadmapArchiveButton from "./RoadmapArchiveButton";

import { roadmapApi } from "@/lib/api/roadmap";

jest.mock("@/lib/api/roadmap", () => ({
  roadmapApi: {
    archiveRoadmap: jest.fn(),
  },
}));
const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

const Wrapper = () => {
  const [archivedAt, setArchivedAt] = useState<string | null>(null);

  return (
    <RoadmapArchiveButton
      roadmapId={1}
      archivedAt={archivedAt}
      onArchiveChanged={() => setArchivedAt("2026-03-22T00:00:00.000Z")}
    />
  );
};

describe("RoadmapArchiveButton 正常系", () => {
  beforeEach(() => {
    // window.confirm をモック（JSDOMでは実装されていないため）
    window.confirm = jest.fn().mockReturnValue(true);
  });

  test("ライブラリボタンをクリックするとアーカイブAPIが呼ばれ、onArchiveChangedも呼ばれる", async () => {
    mockedRoadmapApi.archiveRoadmap.mockResolvedValue({} as any);

    const onArchiveChangedMock = jest.fn();

    render(
      <RoadmapArchiveButton
        roadmapId={1}
        archivedAt={null}
        onArchiveChanged={onArchiveChangedMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // confirm が呼ばれる
    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    // RoadmapApi.archiveRoadmap が呼ばれる
    await waitFor(() => {
      expect(mockedRoadmapApi.archiveRoadmap).toHaveBeenCalledWith(1);
    });

    // APIが終わって onArchiveChanged が呼ばれる
    await waitFor(() => {
      expect(onArchiveChangedMock).toHaveBeenCalled();
    });
  });

  test("移動後に archivedAt が更新されると 'ノートに戻す' に切り替わる", async () => {
    mockedRoadmapApi.archiveRoadmap.mockResolvedValue({} as any);
    window.confirm = jest.fn().mockReturnValue(true);

    render(<Wrapper />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("ノートへ戻す");
    });
  });

  test("移動中はボタンが '移動中...' に変わる", async () => {
    mockedRoadmapApi.archiveRoadmap.mockResolvedValue({} as any);
    window.confirm = jest.fn().mockReturnValue(true);

    render(<RoadmapArchiveButton roadmapId={1} archivedAt={null} />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // 移動中表示になる
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("移動中...");
    });

    // ライブラリへの移動が終わるまで待つ
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("ライブラリへ");
    });
  });
});

describe("RoadmapArchiveButton 異常系", () => {
  test("ライブラリへの移動が失敗したらエラーが表示され、onArchiveChanged は呼ばれず、ボタンは元に戻る", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedRoadmapApi.archiveRoadmap.mockRejectedValueOnce(new Error("archiveRoadmap failed"));

    const onArchiveChangedMock = jest.fn();
    render(
      <RoadmapArchiveButton
        roadmapId={1}
        archivedAt={null}
        onArchiveChanged={onArchiveChangedMock}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // エラー表示
    expect(await screen.findByRole("alert")).toHaveTextContent("移動に失敗しました");
    // onArchiveChanged は呼ばれない
    expect(onArchiveChangedMock).not.toHaveBeenCalled();

    // ボタンが元に戻る（移動中...解除）
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "ライブラリへ" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
