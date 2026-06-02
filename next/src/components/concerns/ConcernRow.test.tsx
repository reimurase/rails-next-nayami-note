// src/components/concerns/ConcernRow.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ConcernRow from "./ConcernRow";

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

const openMenu = () => {
  fireEvent.click(screen.getByRole("button", { name: "操作メニュー" }));
};

describe("ConcernRow", () => {
  beforeEach(() => {
    window.confirm = jest.fn().mockReturnValue(true);
    mockedConcernApi.remove.mockReset();
    mockedConcernApi.archiveConcern.mockReset();
    mockedConcernApi.unarchiveConcern.mockReset();
  });

  test("行をクリックするとonOpenDetailが呼ばれる", () => {
    const onOpenDetail = jest.fn();
    render(<ConcernRow concern={baseConcern} onOpenDetail={onOpenDetail} />);

    fireEvent.click(screen.getByText("テストのトリガー"));

    expect(onOpenDetail).toHaveBeenCalledTimes(1);
  });

  test("削除するとAPIが呼ばれ、onConcernListChangedも呼ばれる", async () => {
    mockedConcernApi.remove.mockResolvedValue({} as any);
    const onConcernListChanged = jest.fn();

    render(
      <ConcernRow
        concern={baseConcern}
        onOpenDetail={jest.fn()}
        onConcernListChanged={onConcernListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockedConcernApi.remove).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onConcernListChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みでない場合、ライブラリへ移動APIが呼ばれる", async () => {
    mockedConcernApi.archiveConcern.mockResolvedValue({} as any);
    const onConcernListChanged = jest.fn();

    render(
      <ConcernRow
        concern={baseConcern}
        onOpenDetail={jest.fn()}
        onConcernListChanged={onConcernListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "ライブラリへ" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にライブラリへ移動しますか？");

    await waitFor(() => {
      expect(mockedConcernApi.archiveConcern).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(onConcernListChanged).toHaveBeenCalledTimes(1);
    });
  });

  test("アーカイブ済みの場合、ノートへ戻すAPIが呼ばれる", async () => {
    mockedConcernApi.unarchiveConcern.mockResolvedValue({} as any);
    const archivedConcern: Concern = { ...baseConcern, archivedAt: "2024-01-02T00:00:00Z" };

    render(<ConcernRow concern={archivedConcern} onOpenDetail={jest.fn()} />);

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "ノートへ戻す" }));

    expect(window.confirm).toHaveBeenCalledWith("本当にノートへ戻しますか？");

    await waitFor(() => {
      expect(mockedConcernApi.unarchiveConcern).toHaveBeenCalledWith(1);
    });
  });

  test("削除が失敗したらエラーが表示され、onConcernListChangedは呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedConcernApi.remove.mockRejectedValueOnce(new Error("remove failed"));
    const onConcernListChanged = jest.fn();

    render(
      <ConcernRow
        concern={baseConcern}
        onOpenDetail={jest.fn()}
        onConcernListChanged={onConcernListChanged}
      />
    );

    openMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "削除" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("削除に失敗しました");
    expect(onConcernListChanged).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
