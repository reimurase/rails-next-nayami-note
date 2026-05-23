// src/components/concerns/ConcernIndex.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import ConcernIndex from "./ConcernIndex";

jest.mock("../detail/ConcernDetailView", () => ({
  __esModule: true,
  default: ({ concernId }: { concernId: number }) => <div>DETAIL:{concernId}</div>,
}));

describe("ConcernIndex", () => {
  test("concernsが0件の場合のメッセージ表示が出る", () => {
    render(<ConcernIndex concerns={[]} onConcernListChanged={jest.fn()} />);

    expect(screen.getByText("なやみ一覧")).toBeInTheDocument();
    expect(screen.getByText("まだなやみはありません")).toBeInTheDocument();
  });

  test("concerns が取得できたら一覧を表示する", () => {
    const mockData = [
      {
        id: 1,
        triggerEvent: "きっかけA",
        content: "悩みA",
        archivedAt: null,
        createdAt: "2025-01-01T00:00:00Z",
      },
      {
        id: 2,
        triggerEvent: "きっかけB",
        content: "悩みB",
        archivedAt: null,
        createdAt: "2025-01-01T00:00:00Z",
      },
    ];

    render(<ConcernIndex concerns={mockData} onConcernListChanged={jest.fn()} />);

    expect(screen.getByText("きっかけA")).toBeInTheDocument();
    expect(screen.getByText("きっかけB")).toBeInTheDocument();
    expect(screen.getByText("悩みA")).toBeInTheDocument();
    expect(screen.getByText("悩みB")).toBeInTheDocument();
  });

  test("行をクリックすると詳細が開く", () => {
    const concerns = [
      {
        id: 1,
        triggerEvent: "a",
        content: "c1",
        archivedAt: null,
        createdAt: "2025-01-01T00:00:00Z",
      },
      {
        id: 2,
        triggerEvent: "b",
        content: "c2",
        archivedAt: null,
        createdAt: "2025-01-01T00:00:00Z",
      },
    ];

    render(<ConcernIndex concerns={concerns} />);

    fireEvent.click(screen.getByText("c1"));
    expect(screen.getByText("DETAIL:1")).toBeInTheDocument();
  });
});
