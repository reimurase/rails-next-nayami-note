// src/components/detail/RoadmapEditor.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import RoadmapEditor from "./RoadmapEditor";

import { roadmapApi } from "@/lib/api/roadmap";

jest.mock("@/lib/api/roadmap", () => ({
  roadmapApi: {
    update: jest.fn(),
  },
}));

const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

describe("RoadmapEditor", () => {
  beforeEach(() => {
    mockedRoadmapApi.update.mockReset();
  });

  test("編集して保存すると update と handleCreated が呼ばれる", async () => {
    mockedRoadmapApi.update.mockResolvedValue({} as any);
    const handleCreated = jest.fn();
    const handleCancelEdit = jest.fn();

    render(
      <RoadmapEditor
        concernId={1}
        roadmap={{ id: 10, goal: "旧ゴール", content: "旧内容", concernId: 1, archivedAt: null }}
        onSaved={handleCreated}
        onCancel={handleCancelEdit}
      />
    );

    fireEvent.change(screen.getByDisplayValue("旧ゴール"), {
      target: { value: "新ゴール" },
    });
    fireEvent.change(screen.getByDisplayValue("旧内容"), {
      target: { value: "新内容" },
    });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(mockedRoadmapApi.update).toHaveBeenCalledWith(1, {
        goal: "新ゴール",
        content: "新内容",
      });
    });

    await waitFor(() => {
      expect(handleCreated).toHaveBeenCalled();
    });
  });
});
