// src/components/roadmaps/RoadmapIndex.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import RoadmapIndex from "./RoadmapIndex";

jest.mock("../detail/ConcernDetailView", () => ({
  __esModule: true,
  default: ({ concernId }: { concernId: number }) => <div>DETAIL:{concernId}</div>,
}));

describe("RoadmapIndex", () => {
  test("roadmapsが0件の場合のメッセージ表示が出る", () => {
    render(<RoadmapIndex roadmaps={[]} />);

    expect(screen.getByText("ロードマップ一覧")).toBeInTheDocument();
    expect(screen.getByText("まだロードマップはありません")).toBeInTheDocument();
  });

  test("roadmaps が取得できたら一覧を表示する", () => {
    const mockData = [
      { id: 1, goal: "ゴールA", content: "ロードマップA" },
      { id: 2, goal: "ゴールB", content: "ロードマップB" },
    ];

    render(<RoadmapIndex roadmaps={mockData} />);

    expect(screen.getByText("ゴールA")).toBeInTheDocument();
    expect(screen.getByText("ゴールB")).toBeInTheDocument();
    expect(screen.getByText("ロードマップA")).toBeInTheDocument();
    expect(screen.getByText("ロードマップB")).toBeInTheDocument();
  });

  test("行をクリックすると詳細が開く", () => {
    const roadmaps = [
      { id: 1, goal: "a", content: "c1" },
      { id: 2, goal: "b", content: "c2" },
    ];

    render(<RoadmapIndex roadmaps={roadmaps} />);

    fireEvent.click(screen.getByText("c1"));
    expect(screen.getByText("DETAIL:1")).toBeInTheDocument();
  });

  test("ESCで詳細が閉じる", () => {
    const roadmaps = [{ id: 1, goal: "a", content: "c1" }];
    render(<RoadmapIndex roadmaps={roadmaps} />);

    fireEvent.click(screen.getByText("c1"));

    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByText("DETAIL:1")).not.toBeInTheDocument();
  });
});
