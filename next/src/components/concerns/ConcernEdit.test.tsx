import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import useSWR from "swr";

import ConcernEdit from "./ConcernEdit";

jest.mock("axios");
jest.mock("swr");

const mockedAxios = jest.mocked(axios);
const mockedUseSWR = jest.mocked(useSWR);

describe("ConcernEdit 正常系（シンプル版）", () => {
  test("入力して送信すると、PATCH API が呼ばれて成功メッセージが表示される", async () => {
    const mockMutate = jest.fn();

    // ★ useSWR のモック：onSuccess は一切呼ばない
    mockedUseSWR.mockReturnValue({
      data: { id: 1, content: "もともとの内容" }, // 実際には使わなくてもOK
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
    } as any);

    // ★ PATCH の成功レスポンス
    mockedAxios.patch.mockResolvedValue({
      data: { id: 1, content: "更新後の内容" },
    });

    // --- コンポーネント描画 ---
    render(<ConcernEdit id={1} />);

    // --- 入力欄を取得して、自分で値を入れる ---
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "更新後の内容" } });
    expect(input).toHaveValue("更新後の内容");

    // --- ボタンをクリック ---
    const button = screen.getByRole("button", { name: "更新" });
    fireEvent.click(button);

    // PATCH が正しい引数で呼ばれたか
    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith("http://localhost:3000/api/v1/concerns/1", {
        concern: { content: "更新後の内容" },
      });
    });

    // mutate が呼ばれているか（雑に1回呼ばれていればOKくらいのノリで）
    expect(mockMutate).toHaveBeenCalled();

    // 成功メッセージが出ているか
    expect(await screen.findByText("更新に成功しました")).toBeInTheDocument();
  });
});
