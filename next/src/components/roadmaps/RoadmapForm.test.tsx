// src/components/roadmaps/RoadmapForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import RoadmapForm from "./RoadmapForm";

import { roadmapApi } from "@/lib/api/roadmap";

jest.mock("@/lib/api/roadmap", () => ({
  roadmapApi: {
    create: jest.fn(),
  },
}));
const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

describe("RoadmapForm API 呼び出し", () => {
  beforeEach(() => {
    mockedRoadmapApi.create.mockReset();
  });

  test("フォーム送信で RoadmapApi.create が呼ばれること", async () => {
    // API成功時のレスポンスをモック
    mockedRoadmapApi.create.mockResolvedValue({} as any);

    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    // ゴールを入力
    fireEvent.change(screen.getByPlaceholderText("ゴール（任意）"), {
      target: { value: "テストのゴール" },
    });

    // ロードマップを入力
    fireEvent.change(screen.getByPlaceholderText("ロードマップ（必須）"), {
      target: { value: "テストのロードマップ" },
    });

    // 送信クリック
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // RoadmapApi.create が呼ばれるまで待つ
    await waitFor(() => {
      expect(mockedRoadmapApi.create).toHaveBeenCalledTimes(1);
    });
    expect(mockedRoadmapApi.create).toHaveBeenCalledWith(1, {
      goal: "テストのゴール",
      content: "テストのロードマップ",
    });
  });
});

describe("RoadmapForm 異常系", () => {
  beforeEach(() => {
    mockedRoadmapApi.create.mockReset();
  });

  test("初期状態では必須エラーが表示されないこと", () => {
    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    expect(screen.queryByText("ロードマップは必須です")).not.toBeInTheDocument();
  });

  test("ロードマップが空のまま追加を押すと必須エラーが表示され、RoadmapApi.create は呼ばれないこと", async () => {
    mockedRoadmapApi.create.mockResolvedValue({} as any);

    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    // 送信クリック（ロードマップ未入力）
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(await screen.findByText("ロードマップは必須です")).toBeInTheDocument();
    expect(mockedRoadmapApi.create).not.toHaveBeenCalled();
  });

  test("ロードマップが1001文字だと文字数エラーが表示され、送信できないこと", () => {
    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    const longText = "a".repeat(1001);

    fireEvent.change(screen.getByPlaceholderText("ロードマップ（必須）"), {
      target: { value: longText },
    });

    expect(screen.getByText("ロードマップは1000文字以内です")).toBeInTheDocument();

    // 超過中はボタンが押せない（disabled）
    expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
  });

  test("ゴールが121文字だと文字数エラーが表示され、送信できないこと", () => {
    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    const longText = "a".repeat(121);

    fireEvent.change(screen.getByPlaceholderText("ゴール（任意）"), {
      target: { value: longText },
    });

    fireEvent.change(screen.getByPlaceholderText("ロードマップ（必須）"), {
      target: { value: "ロードマップ" },
    });

    expect(screen.getByText("ゴールは120文字以内です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
  });

  test("バリデーションで送信されない場合、送信中状態にならないこと", async () => {
    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    fireEvent.click(screen.getByRole("button", { name: "追加" })); // content未入力

    expect(await screen.findByText("ロードマップは必須です")).toBeInTheDocument();

    // 送信中になってない（追加中...にならない / disabledになり続けない）
    expect(screen.getByRole("button", { name: "追加" })).toBeEnabled();
  });

  test("APIが失敗したらエラーが表示され、送信中状態が解除されること", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedRoadmapApi.create.mockRejectedValueOnce(new Error("API error"));

    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    fireEvent.change(screen.getByPlaceholderText("ゴール（任意）"), {
      target: { value: "テストのゴール" },
    });
    fireEvent.change(screen.getByPlaceholderText("ロードマップ（必須）"), {
      target: { value: "テストのロードマップ" },
    });

    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // エラーが表示される
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "保存に失敗しました。時間を置いて再度お試しください。"
    );

    // 成功時コールバックは呼ばれない
    expect(mockOnCreated).not.toHaveBeenCalled();

    // 送信中表示が消えて、ボタンが通常表示に戻る（＝isSubmitting解除）
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "追加" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });

  test("APIが422を返したらフィールド下にエラーが表示されること", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockedRoadmapApi.create.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          errors: {
            content: [{ code: "blank" }],
          },
        },
      },
    });

    const mockOnCreated = jest.fn();
    render(<RoadmapForm concernId={1} onCreated={mockOnCreated} />);

    // フロントの必須チェックは通し、サーバーの422表示だけを検証する
    fireEvent.change(screen.getByPlaceholderText("ゴール（任意）"), {
      target: { value: "テストのゴール" },
    });
    fireEvent.change(screen.getByPlaceholderText("ロードマップ（必須）"), {
      target: { value: "テストのロードマップ" },
    });

    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    // serverErrors が表示される（mapRoadmapServerErrors が効いている証拠）
    expect(await screen.findByText("ロードマップは必須です")).toBeInTheDocument();

    // 成功時コールバックは呼ばれない
    expect(mockOnCreated).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
