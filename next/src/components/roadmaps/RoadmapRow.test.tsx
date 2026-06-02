// src/components/roadmaps/RoadmapRow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import RoadmapRow from "./RoadmapRow";

import { roadmapApi } from "@/lib/api/roadmap";
import type { Roadmap } from "@/types/roadmap";

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

const openMenu = () => {
  fireEvent.click(screen.getByRole("button", { name: "操作メニュー" }));
};

describe("RoadmapRow", () => {
  beforeEach(() => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedRoadmapApi.remove.mockReset();
    mockedRoadmapApi.archiveRoadmap.mockReset();
    mockedRoadmapApi.unarchiveRoadmap.mockReset();
  });

  test("行をクリックするとonOpenDetailが呼ばれる", () => {
    const onOpenDetail = jest.fn();
    render(<RoadmapRow roadmap={baseRoadmap} onOpenDetail={onOpenDetail} />);

    fireEvent.click(screen.getByText("テストのゴール"));

    expect(onOpenDetail).toHaveBeenCalledTimes(1);
  });

  test("削除するとAPIが呼ばれ、onRoadmapListChangedも呼ばれる", async () => {
    mockedRoadmapApi.remove.mockResolvedValue({} as any);
    const onRoadmapListChanged = jest.fn();

    render(
      <RoadmapRow
        roadmap={baseRoadmap}
        onOpenDetail={jest.fn()}
        onRoadmapListChanged={onRoadmapListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));

    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    await waitFor(() => {
      expect(mockedRoadmapApi.remove).toHaveBeenCalledWith(10);
    });
    await waitFor(() => {
      expect(onRoadmapListChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みでない場合、ライブラリへ移動APIが呼ばれる", async () => {
    mockedRoadmapApi.archiveRoadmap.mockResolvedValue({} as any);
    const onRoadmapListChanged = jest.fn();

    render(
      <RoadmapRow
        roadmap={baseRoadmap}
        onOpenDetail={jest.fn()}
        onRoadmapListChanged={onRoadmapListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "ライブラリへ" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    await waitFor(() => {
      expect(mockedRoadmapApi.archiveRoadmap).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onRoadmapListChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みの場合、ノートへ戻すAPIが呼ばれる", async () => {
    mockedRoadmapApi.unarchiveRoadmap.mockResolvedValue({} as any);
    const archivedRoadmap: Roadmap = { ...baseRoadmap, archivedAt: "2024-01-02T00:00:00Z" };

    render(<RoadmapRow roadmap={archivedRoadmap} onOpenDetail={jest.fn()} />);

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "ノートへ戻す" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にノートへ戻しますか？");

    await waitFor(() => {
      expect(mockedRoadmapApi.unarchiveRoadmap).toHaveBeenCalledWith(1);
    });
  });

  test("削除が失敗したらエラーが表示され、onRoadmapListChangedは呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedRoadmapApi.remove.mockRejectedValueOnce(new Error("remove failed"));
    const onRoadmapListChanged = jest.fn();

    render(
      <RoadmapRow
        roadmap={baseRoadmap}
        onOpenDetail={jest.fn()}
        onRoadmapListChanged={onRoadmapListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    expect(onRoadmapListChanged).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
