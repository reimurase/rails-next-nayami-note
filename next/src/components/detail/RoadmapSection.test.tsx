// src/components/detail/RoadmapSection.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import RoadmapSection from "./RoadmapSection";

import { roadmapApi } from "@/lib/api/roadmap";
import type { Roadmap } from "@/types/roadmap";

jest.mock("../roadmaps/RoadmapForm", () => () => <div data-testid="roadmap-form" />);

jest.mock("@/lib/api/roadmap", () => ({
  roadmapApi: {
    remove: jest.fn(),
    archiveRoadmap: jest.fn(),
    unarchiveRoadmap: jest.fn(),
  },
}));
const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

const baseRoadmap: Roadmap = {
  id: 1,
  goal: "テストのゴール",
  content: "テストの内容",
  concernId: 10,
  archivedAt: null,
};

describe("RoadmapSection", () => {
  beforeEach(() => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedRoadmapApi.remove.mockReset();
    mockedRoadmapApi.archiveRoadmap.mockReset();
    mockedRoadmapApi.unarchiveRoadmap.mockReset();
  });

  test("新規作成を押すとRoadmapFormが表示される", () => {
    render(<RoadmapSection concernId={10} roadmap={null} />);

    fireEvent.click(screen.getByRole("button", { name: "新規作成" }));

    expect(screen.getByTestId("roadmap-form")).toBeInTheDocument();
  });

  test("編集を押すと編集モードに切り替わる", () => {
    render(
      <RoadmapSection
        concernId={10}
        roadmap={{ id: 1, goal: "旧ゴール", content: "旧内容", concernId: 10, archivedAt: null }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("旧ゴール")).toBeInTheDocument();
    expect(screen.getByDisplayValue("旧内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });

  test("削除するとAPIが呼ばれ、onRoadmapChangedも呼ばれる", async () => {
    mockedRoadmapApi.remove.mockResolvedValue({} as any);
    const onRoadmapChanged = jest.fn();

    render(
      <RoadmapSection concernId={10} roadmap={baseRoadmap} onRoadmapChanged={onRoadmapChanged} />
    );

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    await waitFor(() => {
      expect(mockedRoadmapApi.remove).toHaveBeenCalledWith(10);
    });
    await waitFor(() => {
      expect(onRoadmapChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みでない場合、ライブラリへ移動APIが呼ばれる", async () => {
    mockedRoadmapApi.archiveRoadmap.mockResolvedValue({} as any);
    const onRoadmapChanged = jest.fn();

    render(
      <RoadmapSection concernId={10} roadmap={baseRoadmap} onRoadmapChanged={onRoadmapChanged} />
    );

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    await waitFor(() => {
      expect(mockedRoadmapApi.archiveRoadmap).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onRoadmapChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みの場合、ノートへ戻すAPIが呼ばれる", async () => {
    mockedRoadmapApi.unarchiveRoadmap.mockResolvedValue({} as any);
    const archivedRoadmap: Roadmap = { ...baseRoadmap, archivedAt: "2024-01-02T00:00:00Z" };

    render(<RoadmapSection concernId={10} roadmap={archivedRoadmap} />);

    fireEvent.click(screen.getByRole("button", { name: "ノートへ戻す" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にノートへ戻しますか？");

    await waitFor(() => {
      expect(mockedRoadmapApi.unarchiveRoadmap).toHaveBeenCalledWith(1);
    });
  });

  test("削除が失敗したらエラーが表示され、onRoadmapChangedは呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedRoadmapApi.remove.mockRejectedValueOnce(new Error("remove failed"));
    const onRoadmapChanged = jest.fn();

    render(
      <RoadmapSection concernId={10} roadmap={baseRoadmap} onRoadmapChanged={onRoadmapChanged} />
    );

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    expect(onRoadmapChanged).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
