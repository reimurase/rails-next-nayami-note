// src/components/concerns/ConcernDeleteButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";

import ConcernDeleteButton from "./ConcernDeleteButton";

jest.mock("axios");
const mockedAxios = jest.mocked(axios);

describe("ConcernDeleteButton 正常系", () => {
  beforeEach(() => {
    // window.confirm をモック（JSDOMでは実装されていないため）
    window.confirm = jest.fn().mockReturnValue(true);
  });

  test("削除ボタンをクリックすると削除APIが呼ばれ、onDeletedも呼ばれる", async () => {
    mockedAxios.delete.mockResolvedValue({ status: 204 });

    const onDeletedMock = jest.fn();

    render(<ConcernDeleteButton id={1} onDeleted={onDeletedMock} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // confirm が呼ばれる
    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    // axios.delete が呼ばれる
    expect(mockedAxios.delete).toHaveBeenCalledWith("http://localhost:3000/api/v1/concerns/1");

    // APIが終わって onDeleted が呼ばれる
    await waitFor(() => {
      expect(onDeletedMock).toHaveBeenCalled();
    });
  });

  test("削除中はボタンが '削除中...' に変わる", async () => {
    mockedAxios.delete.mockResolvedValue({ status: 204 });
    window.confirm = jest.fn().mockReturnValue(true);

    render(<ConcernDeleteButton id={1} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // 削除中表示になる
    expect(screen.getByRole("button")).toHaveTextContent("削除中...");

    // 削除が終わるまで待つ
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("削除");
    });
  });
});
