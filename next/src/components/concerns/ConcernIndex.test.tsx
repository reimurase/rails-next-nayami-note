import { render, screen } from "@testing-library/react";
import useSWR from "swr";

import ConcernIndex from "./ConcernIndex";

jest.mock("swr");

const mockedUseSWR = jest.mocked(useSWR);

describe("ConcernIndex", () => {
  test("読み込み中の表示が出る", () => {
    // SWR がまだ data を返さない状態をシミュレート
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
    } as any);

    render(<ConcernIndex />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  test("concerns が取得できたら一覧を表示する", async () => {
    const mockData = [
      { id: 1, content: "悩みA" },
      { id: 2, content: "悩みB" },
    ];

    mockedUseSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<ConcernIndex />);

    // リストとして表示されるものをチェック
    expect(screen.getByText("悩みA")).toBeInTheDocument();
    expect(screen.getByText("悩みB")).toBeInTheDocument();
  });
});
