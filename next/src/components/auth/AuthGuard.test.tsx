// src/components/auth/AuthGuard.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import useSWR from "swr";
import axios from "axios";

import { AuthGuard } from "./AuthGuard";

import { authApi } from "@/lib/api/auth";

const mockedUseSWR = useSWR as unknown as jest.Mock;

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/api/auth", () => ({
  authApi: {
    me: jest.fn(),
  },
}));

function axios401Error() {
  return new axios.AxiosError("Unauthorized", "ERR_BAD_RESPONSE", undefined, undefined, {
    status: 401,
    data: null,
    headers: {},
    config: {} as any,
    statusText: "Unauthorized",
  });
}

describe("AuthGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loading中は何も描画しない", () => {
    mockedUseSWR.mockReturnValue({ error: undefined, isLoading: true });

    const { container } = render(
      <AuthGuard>
        <div>child</div>
      </AuthGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("401のときは何も描画しない（childrenも出ない）", () => {
    mockedUseSWR.mockReturnValue({ error: axios401Error(), isLoading: false });

    const { container } = render(
      <AuthGuard>
        <div>child</div>
      </AuthGuard>
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });

  test("401以外のエラーはエラーメッセージを表示する", () => {
    mockedUseSWR.mockReturnValue({ error: new Error("boom"), isLoading: false });

    render(
      <AuthGuard>
        <div>child</div>
      </AuthGuard>
    );

    expect(
      screen.getByText("セッションの読み込みに失敗しました。ページを再度更新してください。")
    ).toBeInTheDocument();
    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });

  test("dataもerrorもない場合は何も描画しない（mutateによるキャッシュクリア時）", () => {
    mockedUseSWR.mockReturnValue({ data: undefined, error: undefined, isLoading: false });

    const { container } = render(
      <AuthGuard>
        <div>child</div>
      </AuthGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("成功時はchildrenを表示する", () => {
    mockedUseSWR.mockReturnValue({
      data: { id: 1, email: "test@example.com", autoArchiveEnabled: false },
      error: undefined,
      isLoading: false,
    });

    render(
      <AuthGuard>
        <div>child</div>
      </AuthGuard>
    );

    expect(screen.getByText("child")).toBeInTheDocument();
  });

  test("useSWRのfetcherがauthApi.meを呼ぶ", async () => {
    (authApi.me as jest.Mock).mockResolvedValue({ data: { id: 1 } });

    mockedUseSWR.mockImplementation((key: string, fetcher: () => Promise<any>) => {
      // ここでfetcherを呼んでしまう（SWR本体の代わり）
      void fetcher();
      return { error: undefined, isLoading: true };
    });

    render(
      <AuthGuard>
        <div>child</div>
      </AuthGuard>
    );

    expect(mockedUseSWR).toHaveBeenCalled();
    expect(mockedUseSWR.mock.calls[0][0]).toBe("me");

    // fetcher実行により呼ばれる
    expect(authApi.me).toHaveBeenCalledTimes(1);
  });
});
