// src/components/detail/ConcernDetailView.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import useSWR from "swr";

import ConcernDetailView from "./ConcernDetailView";

import { concernApi } from "@/lib/api/concern";

jest.mock("swr");
jest.mock("@/lib/api/concern", () => ({
  concernApi: {
    remove: jest.fn(),
  },
}));
jest.mock("./ConcernSection", () => ({
  __esModule: true,
  default: ({ onConcernDelete }: { onConcernDelete?: () => Promise<void> }) => (
    <div data-testid="concern-section">
      <button onClick={() => onConcernDelete?.()}>削除</button>
    </div>
  ),
}));
jest.mock("./IssueSection", () => ({
  __esModule: true,
  default: () => <div data-testid="issue-section" />,
}));
jest.mock("./RoadmapSection", () => ({
  __esModule: true,
  default: () => <div data-testid="roadmap-section" />,
}));

const mockedUseSWR = jest.mocked(useSWR);
const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

const swrData = {
  data: {
    concern: {
      id: 1,
      triggerEvent: "きっかけ",
      content: "なやみ",
      archivedAt: null,
      createdAt: "2024-01-01T00:00:00Z",
    },
    issue: null,
    roadmap: null,
  },
  error: undefined,
  isLoading: false,
  mutate: jest.fn(),
};

describe("ConcernDetailView", () => {
  test("concern が取得できたら各セクションを表示する", () => {
    mockedUseSWR.mockReturnValue(swrData as any);

    render(<ConcernDetailView concernId={1} />);

    expect(screen.getByTestId("concern-section")).toBeInTheDocument();
    expect(screen.getByTestId("issue-section")).toBeInTheDocument();
    expect(screen.getByTestId("roadmap-section")).toBeInTheDocument();
  });

  test("削除が失敗したらエラーが表示される", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedUseSWR.mockReturnValue(swrData as any);
    mockedConcernApi.remove.mockRejectedValue(new Error("delete failed"));

    render(<ConcernDetailView concernId={1} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("削除に失敗しました");
    });

    consoleSpy.mockRestore();
  });
});
