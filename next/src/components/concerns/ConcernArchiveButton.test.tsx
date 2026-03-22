// src/components/concerns/ConcernArchiveButton.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";

import ConcernArchiveButton from "./ConcernArchiveButton";

import { concernApi } from "@/lib/api/concern";

jest.mock("@/lib/api/concern", () => ({
  concernApi: {
    archiveConcern: jest.fn(),
  },
}));
const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

const Wrapper = () => {
  const [archivedAt, setArchivedAt] = useState<string | null>(null);

  return (
    <ConcernArchiveButton
      id={1}
      archivedAt={archivedAt}
      onArchiveChanged={() => setArchivedAt("2026-03-22T00:00:00.000Z")}
    />
  );
};

describe("ConcernArchiveButton 正常系", () => {
  beforeEach(() => {
    // window.confirm をモック（JSDOMでは実装されていないため）
    window.confirm = jest.fn().mockReturnValue(true);
  });

  test("ライブラリボタンをクリックするとアーカイブAPIが呼ばれ、onArchiveChangedも呼ばれる", async () => {
    mockedConcernApi.archiveConcern.mockResolvedValue({} as any);

    const onArchiveChangedMock = jest.fn();

    render(
      <ConcernArchiveButton id={1} archivedAt={null} onArchiveChanged={onArchiveChangedMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // confirm が呼ばれる
    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    // ConcernApi.archiveConcern が呼ばれる
    await waitFor(() => {
      expect(mockedConcernApi.archiveConcern).toHaveBeenCalledWith(1);
    });

    // APIが終わって onArchiveChanged が呼ばれる
    await waitFor(() => {
      expect(onArchiveChangedMock).toHaveBeenCalled();
    });
  });

  test("移動後に archivedAt が更新されると 'ノートに戻す' に切り替わる", async () => {
    mockedConcernApi.archiveConcern.mockResolvedValue({} as any);
    window.confirm = jest.fn().mockReturnValue(true);

    render(<Wrapper />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("ノートへ戻す");
    });
  });

  test("移動中はボタンが '移動中...' に変わる", async () => {
    mockedConcernApi.archiveConcern.mockResolvedValue({} as any);
    window.confirm = jest.fn().mockReturnValue(true);

    render(<ConcernArchiveButton id={1} archivedAt={null} />);

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
  test("ライブラリへの移動が失敗したらエラーが表示され、onArchiveChanged は呼ばれず、ボタンは元に戻る", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedConcernApi.archiveConcern.mockRejectedValueOnce(new Error("archiveConcern failed"));

    const onArchiveChangedMock = jest.fn();
    render(
      <ConcernArchiveButton id={1} archivedAt={null} onArchiveChanged={onArchiveChangedMock} />
    );

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    // エラー表示
    expect(await screen.findByRole("alert")).toHaveTextContent("移動に失敗しました");
    // onArchiveChanged は呼ばれない
    expect(onArchiveChangedMock).not.toHaveBeenCalled();

    // ボタンが元に戻る（移動中...解除）
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "ライブラリへ" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
