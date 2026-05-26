// src/components/detail/ConcernDetailView.test.tsx
import { render, screen } from "@testing-library/react";
import useSWR from "swr";

import ConcernDetailView from "./ConcernDetailView";

jest.mock("swr");
jest.mock("./ConcernSection", () => ({
  __esModule: true,
  default: () => <div data-testid="concern-section" />,
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

describe("ConcernDetailView", () => {
  test("concern が取得できたら各セクションを表示する", () => {
    mockedUseSWR.mockReturnValue({
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
    } as any);

    render(<ConcernDetailView concernId={1} />);

    expect(screen.getByTestId("concern-section")).toBeInTheDocument();
    expect(screen.getByTestId("issue-section")).toBeInTheDocument();
    expect(screen.getByTestId("roadmap-section")).toBeInTheDocument();
  });
});
