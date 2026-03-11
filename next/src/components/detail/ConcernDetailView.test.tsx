// src/components/detail/ConcernDetailView.test.tsx
import { render, screen } from "@testing-library/react";
import useSWR from "swr";

import ConcernDetailView from "./ConcernDetailView";

jest.mock("swr");
const mockedUseSWR = jest.mocked(useSWR);

describe("ConcernDetailView", () => {
  test("concern が取得できたら詳細を表示する", () => {
    mockedUseSWR.mockReturnValue({
      data: {
        concern: {
          id: 1,
          triggerEvent: "きっかけA",
          content: "なやみA",
        },
        issue: null,
        roadmap: null,
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<ConcernDetailView concernId={1} />);

    expect(screen.getByText("きっかけ: きっかけA")).toBeInTheDocument();
    expect(screen.getByText("内容: なやみA")).toBeInTheDocument();
    expect(screen.getByText("issue はありません")).toBeInTheDocument();
    expect(screen.getByText("roadmap はありません")).toBeInTheDocument();
  });
});
