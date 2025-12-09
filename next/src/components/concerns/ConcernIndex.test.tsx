// src/components/concerns/ConcernIndex.test.tsx
import { render, screen } from "@testing-library/react";

import ConcernIndex from "./ConcernIndex";

describe("ConcernIndex", () => {
  test("読み込み中の表示が出る", () => {
    render(
      <ConcernIndex concerns={undefined} isLoading={true} error={undefined} onChanged={jest.fn()} />
    );

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  test("concerns が取得できたら一覧を表示する", () => {
    const mockData = [
      { id: 1, content: "悩みA" },
      { id: 2, content: "悩みB" },
    ];

    render(
      <ConcernIndex concerns={mockData} isLoading={false} error={undefined} onChanged={jest.fn()} />
    );

    expect(screen.getByText("悩みA")).toBeInTheDocument();
    expect(screen.getByText("悩みB")).toBeInTheDocument();
  });
});
