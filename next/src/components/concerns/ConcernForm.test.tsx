import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";

import ConcernForm from "./ConcernForm";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ConcernForm API 呼び出し", () => {
  test("フォーム送信で axios.post が呼ばれること", async () => {
    // API成功時のレスポンスをモック
    mockedAxios.post.mockResolvedValue({
      data: { message: "success" },
    });

    const mockOnCreated = jest.fn();
    render(<ConcernForm onCreated={mockOnCreated} />);

    // 入力
    fireEvent.change(screen.getByPlaceholderText("悩みを入力"), {
      target: { value: "テストの悩み" },
    });

    // 送信クリック
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // axios.post が呼ばれるまで待つ
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
    expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:3000/api/v1/concerns", {
      concern: { content: "テストの悩み" },
    });
  });
});
