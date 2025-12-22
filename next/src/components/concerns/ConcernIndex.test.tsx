// src/components/concerns/ConcernIndex.test.tsx
import { render, screen } from "@testing-library/react";

import ConcernIndex from "./ConcernIndex";

describe("ConcernIndex", () => {
  test("concernsが0件の場合のメッセージ表示が出る", () => {
    render(<ConcernIndex concerns={[]} onChanged={jest.fn()} />);

    expect(screen.getByText("なやみ一覧")).toBeInTheDocument();
    expect(screen.getByText("まだなやみはありません")).toBeInTheDocument();
  });

  test("concerns が取得できたら一覧を表示する", () => {
    const mockData = [
      { id: 1, trigger_event: "きっかけA", content: "悩みA" },
      { id: 2, trigger_event: "きっかけB", content: "悩みB" },
    ];

    render(<ConcernIndex concerns={mockData} onChanged={jest.fn()} />);

    expect(screen.getByText("きっかけA")).toBeInTheDocument();
    expect(screen.getByText("きっかけB")).toBeInTheDocument();
    expect(screen.getByText("悩みA")).toBeInTheDocument();
    expect(screen.getByText("悩みB")).toBeInTheDocument();
  });
});
