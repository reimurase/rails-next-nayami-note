// src/components/detail/RoadmapSection.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";

import RoadmapSection from "./RoadmapSection";

describe("RoadmapSection", () => {
  test("編集を押すと編集モードに切り替わる", () => {
    render(
      <RoadmapSection
        concernId={1}
        roadmap={{ id: 10, goal: "旧ゴール", content: "旧内容", concernId: 1, archivedAt: null }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("旧ゴール")).toBeInTheDocument();
    expect(screen.getByDisplayValue("旧内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });
});
