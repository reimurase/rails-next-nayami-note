// src/components/roadmaps/RoadmapIndex.test.tsx
import { render, screen } from "@testing-library/react";

import RoadmapIndex from "./RoadmapIndex";

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
});
