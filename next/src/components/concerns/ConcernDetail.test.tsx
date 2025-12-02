// src/components/concerns/ConcernDetail.test.tsx
import { render, screen } from "@testing-library/react";
import useSWR from "swr";

import ConcernDetail from "./ConcernDetail";

jest.mock("swr");
const mockedUseSWR = jest.mocked(useSWR);

describe("ConcernDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("読み込み中の表示が出る", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
    } as any);

    render(<ConcernDetail id={1} />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  test("エラーが発生した場合の表示が出る", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: new Error("something went wrong"),
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<ConcernDetail id={1} />);
    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
  });

  test("concern が存在しない場合は『データがありません』と表示する", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<ConcernDetail id={1} />);
    expect(screen.getByText("データがありません")).toBeInTheDocument();
  });

  test("concern が取得できたら詳細を表示する", () => {
    mockedUseSWR.mockReturnValue({
      data: { id: 1, content: "テストの悩み" },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<ConcernDetail id={1} />);
    expect(screen.getByText("ID: 1")).toBeInTheDocument();
    expect(screen.getByText("内容: テストの悩み")).toBeInTheDocument();
  });
});
