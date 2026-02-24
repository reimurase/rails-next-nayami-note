// src/components/issues/IssueDetail.test.tsx
import { render, screen } from "@testing-library/react";
import useSWR from "swr";

import IssueDetail from "./IssueDetail";

jest.mock("swr");
const mockedUseSWR = jest.mocked(useSWR);

describe("IssueDetail", () => {
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

    render(<IssueDetail id={1} />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  test("エラーが発生した場合の表示が出る", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: new Error("something went wrong"),
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<IssueDetail id={1} />);
    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
  });

  test("issue が存在しない場合は『データがありません』と表示する", () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<IssueDetail id={1} />);
    expect(screen.getByText("データがありません")).toBeInTheDocument();
  });

  test("issue が取得できたら詳細を表示する", () => {
    mockedUseSWR.mockReturnValue({
      data: { id: 1, title: "テストのタイトル", content: "テストの問題" },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<IssueDetail id={1} />);
    expect(screen.getByText("タイトル: テストのタイトル")).toBeInTheDocument();
    expect(screen.getByText("内容: テストの問題")).toBeInTheDocument();
  });
});
