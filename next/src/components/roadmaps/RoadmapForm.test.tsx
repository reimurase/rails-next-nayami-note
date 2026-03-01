// src/components/roadmaps/RoadmapForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import RoadmapForm from "./RoadmapForm";

import { roadmapApi } from "@/lib/roadmapApi";

jest.mock("@/lib/roadmapApi", () => ({
  roadmapApi: {
    create: jest.fn(),
  },
}));
const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

describe("RoadmapForm API 呼び出し", () => {
  beforeEach(() => {
    mockedRoadmapApi.create.mockReset();
  });

  test("フォーム送信で RoadmapApi.create が呼ばれること", async () => {
    // API成功時のレスポンスをモック
    mockedRoadmapApi.create.mockResolvedValue({} as any);

    const mockOnCreated = jest.fn();
    render(<RoadmapForm onCreated={mockOnCreated} />);

    // ゴールを入力
    fireEvent.change(screen.getByPlaceholderText("ゴール（任意）"), {
      target: { value: "テストのゴール" },
    });

    // ロードマップを入力
    fireEvent.change(screen.getByPlaceholderText("ロードマップ（任意）"), {
      target: { value: "テストのロードマップ" },
    });

    // 送信クリック
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // RoadmapApi.create が呼ばれるまで待つ
    await waitFor(() => {
      expect(mockedRoadmapApi.create).toHaveBeenCalledTimes(1);
    });
    expect(mockedRoadmapApi.create).toHaveBeenCalledWith({
      goal: "テストのゴール",
      content: "テストのロードマップ",
    });
  });
});
