// src/components/concerns/ConcernIndex.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import ConcernIndex from "./ConcernIndex";

jest.mock("./ConcernDetail", () => ({
  __esModule: true,
  default: ({ id }: { id: number }) => <div>DETAIL:{id}</div>,
}));

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

  test("行をクリックすると詳細が開く", () => {
    const concerns = [
      { id: 1, trigger_event: "a", content: "c1" },
      { id: 2, trigger_event: "b", content: "c2" },
    ];

    render(<ConcernIndex concerns={concerns} />);

    fireEvent.click(screen.getByText("c1"));
    expect(screen.getByText("DETAIL:1")).toBeInTheDocument();
  });

  test("ESCで詳細が閉じる", () => {
    const concerns = [{ id: 1, trigger_event: "a", content: "c1" }];
    render(<ConcernIndex concerns={concerns} />);

    fireEvent.click(screen.getByText("c1"));

    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByText("DETAIL:1")).not.toBeInTheDocument();
  });
});
