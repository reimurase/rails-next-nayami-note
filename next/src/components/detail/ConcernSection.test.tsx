// src/components/detail/ConcernSection.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import ConcernSection from "./ConcernSection";

import { concernApi } from "@/lib/api/concern";
import type { Concern } from "@/types/concern";

jest.mock("@/lib/api/concern", () => ({
  concernApi: {
    remove: jest.fn(),
    archiveConcern: jest.fn(),
    unarchiveConcern: jest.fn(),
  },
}));
const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

const baseConcern: Concern = {
  id: 1,
  triggerEvent: "テストのトリガー",
  content: "テストの内容",
  archivedAt: null,
  createdAt: "2024-01-01T00:00:00Z",
};

describe("ConcernSection", () => {
  beforeEach(() => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedConcernApi.remove.mockReset();
    mockedConcernApi.archiveConcern.mockReset();
    mockedConcernApi.unarchiveConcern.mockReset();
  });

  test("編集を押すと編集モードに切り替わる", () => {
    render(
      <ConcernSection
        concern={{
          id: 10,
          triggerEvent: "旧きっかけ",
          content: "旧内容",
          archivedAt: null,
          createdAt: "2025-01-01T00:00:00Z",
        }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("旧きっかけ")).toBeInTheDocument();
    expect(screen.getByDisplayValue("旧内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });

  test("削除するとAPIが呼ばれ、onConcernDeletedも呼ばれる", async () => {
    mockedConcernApi.remove.mockResolvedValue({} as any);
    const onConcernDeleted = jest.fn();

    render(<ConcernSection concern={baseConcern} onConcernDeleted={onConcernDeleted} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(window.confirm).toHaveBeenCalledWith("本当に削除しますか？");

    await waitFor(() => {
      expect(mockedConcernApi.remove).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onConcernDeleted).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みでない場合、ライブラリへ移動APIが呼ばれる", async () => {
    mockedConcernApi.archiveConcern.mockResolvedValue({} as any);
    const onConcernArchived = jest.fn();

    render(<ConcernSection concern={baseConcern} onConcernArchived={onConcernArchived} />);

    fireEvent.click(screen.getByRole("button", { name: "ライブラリへ" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    await waitFor(() => {
      expect(mockedConcernApi.archiveConcern).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onConcernArchived).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みの場合、ノートへ戻すAPIが呼ばれる", async () => {
    mockedConcernApi.unarchiveConcern.mockResolvedValue({} as any);
    const archivedConcern: Concern = { ...baseConcern, archivedAt: "2024-01-02T00:00:00Z" };

    render(<ConcernSection concern={archivedConcern} />);

    fireEvent.click(screen.getByRole("button", { name: "ノートへ戻す" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にノートへ戻しますか？");

    await waitFor(() => {
      expect(mockedConcernApi.unarchiveConcern).toHaveBeenCalledWith(1);
    });
  });

  test("削除が失敗したらエラーが表示され、onConcernDeletedは呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedConcernApi.remove.mockRejectedValueOnce(new Error("remove failed"));
    const onConcernDeleted = jest.fn();

    render(<ConcernSection concern={baseConcern} onConcernDeleted={onConcernDeleted} />);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    expect(onConcernDeleted).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
