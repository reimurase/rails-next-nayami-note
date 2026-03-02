// src/components/concerns/ConcernDeleteButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ConcernDeleteButton from "./ConcernDeleteButton";

import { concernApi } from "@/lib/api/concern";

jest.mock("@/lib/api/concern", () => ({
  concernApi: {
    remove: jest.fn(),
  },
}));
const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

describe("ConcernDeleteButton 正常系", () => {
  beforeEach(() => {
    // window.confirm をモック（JSDOMでは実装されていないため）
    window.confirm = jest.fn().mockReturnValue(true);
  });

  test("削除ボタンをクリックすると削除APIが呼ばれ、onDeletedも呼ばれる", async () => {
    mockedConcernApi.remove.mockResolvedValue({} as any);

    const onDeletedMock = jest.fn();

    render(<ConcernDeleteButton id={1} onDeleted={onDeletedMock} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // confirm が呼ばれる
    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    // ConcernApi.delete が呼ばれる
    await waitFor(() => {
      expect(mockedConcernApi.remove).toHaveBeenCalledWith(1);
    });

    // APIが終わって onDeleted が呼ばれる
    await waitFor(() => {
      expect(onDeletedMock).toHaveBeenCalled();
    });
  });

  test("削除中はボタンが '削除中...' に変わる", async () => {
    mockedConcernApi.remove.mockResolvedValue({} as any);
    window.confirm = jest.fn().mockReturnValue(true);

    render(<ConcernDeleteButton id={1} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // 削除中表示になる
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("削除中...");
    });

    // 削除が終わるまで待つ
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("削除");
    });
  });
});

describe("ConcernDeleteButton 異常系", () => {
  test("削除が失敗したらエラーが表示され、onDeleted は呼ばれず、ボタンは元に戻る", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedConcernApi.remove.mockRejectedValueOnce(new Error("remove failed"));

    const onDeletedMock = jest.fn();
    render(<ConcernDeleteButton id={1} onDeleted={onDeletedMock} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    // エラー表示
    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    // onDeleted は呼ばれない
    expect(onDeletedMock).not.toHaveBeenCalled();

    // ボタンが元に戻る（削除中...解除）
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "削除" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
