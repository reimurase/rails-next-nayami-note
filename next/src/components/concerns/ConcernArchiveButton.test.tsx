// src/components/concerns/ConcernArchiveButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ConcernArchiveButton from "./ConcernArchiveButton";

import { concernApi } from "@/lib/api/concern";

jest.mock("@/lib/api/concern", () => ({
  concernApi: {
    archiveConcern: jest.fn(),
  },
}));
const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

describe("ConcernArchiveButton 正常系", () => {
  beforeEach(() => {
    // window.confirm をモック（JSDOMでは実装されていないため）
    window.confirm = jest.fn().mockReturnValue(true);
  });

  test("ライブラリボタンをクリックするとアーカイブAPIが呼ばれ、onArchivedも呼ばれる", async () => {
    mockedConcernApi.archiveConcern.mockResolvedValue({} as any);

    const onArchivedMock = jest.fn();

    render(<ConcernArchiveButton id={1} onArchived={onArchivedMock} />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // confirm が呼ばれる
    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    // ConcernApi.archiveConcern が呼ばれる
    await waitFor(() => {
      expect(mockedConcernApi.archiveConcern).toHaveBeenCalledWith(1, null);
    });

    // APIが終わって onArchived が呼ばれる
    await waitFor(() => {
      expect(onArchivedMock).toHaveBeenCalled();
    });
  });

  test("移動中はボタンが '移動中...' に変わる", async () => {
    mockedConcernApi.archiveConcern.mockResolvedValue({} as any);
    window.confirm = jest.fn().mockReturnValue(true);

    render(<ConcernArchiveButton id={1} />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // 移動中表示になる
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("移動中...");
    });

    // ライブラリへの移動が終わるまで待つ
    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("ライブラリへ");
    });
  });
});

describe("ConcernArchiveButton 異常系", () => {
  test("ライブラリへの移動が失敗したらエラーが表示され、onArchived は呼ばれず、ボタンは元に戻る", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedConcernApi.archiveConcern.mockRejectedValueOnce(new Error("archiveConcern failed"));

    const onArchivedMock = jest.fn();
    render(<ConcernArchiveButton id={1} onArchived={onArchivedMock} />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // エラー表示
    expect(await screen.findByRole("alert")).toHaveTextContent("移動に失敗しました");
    // onArchived は呼ばれない
    expect(onArchivedMock).not.toHaveBeenCalled();

    // ボタンが元に戻る（移動中...解除）
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "ライブラリへ" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
