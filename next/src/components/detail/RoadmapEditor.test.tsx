// src/components/detail/RoadmapEditor.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import RoadmapEditor from "./RoadmapEditor";

import { roadmapApi } from "@/lib/api/roadmap";

jest.mock("@/lib/api/roadmap", () => ({
  roadmapApi: {
    update: jest.fn(),
  },
}));

const mockedRoadmapApi = roadmapApi as jest.Mocked<typeof roadmapApi>;

describe("RoadmapEditor", () => {
  beforeEach(() => {
    mockedRoadmapApi.update.mockReset();
  });

  test("編集して保存すると update と handleCreated が呼ばれる", async () => {
    mockedRoadmapApi.update.mockResolvedValue({} as any);
    const handleCreated = jest.fn();
    const handleCancelEdit = jest.fn();

    render(
      <RoadmapEditor
        concernId={1}
        roadmap={{ id: 10, goal: "旧ゴール", content: "旧内容", concernId: 1, archivedAt: null }}
        onSaved={handleCreated}
        onCancel={handleCancelEdit}
      />
    );

    fireEvent.change(screen.getByDisplayValue("旧ゴール"), {
      target: { value: "新ゴール" },
    });
    fireEvent.change(screen.getByDisplayValue("旧内容"), {
      target: { value: "新内容" },
    });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(mockedRoadmapApi.update).toHaveBeenCalledWith(1, {
        goal: "新ゴール",
        content: "新内容",
      });
    });

    await waitFor(() => {
      expect(handleCreated).toHaveBeenCalled();
    });
  });
});

describe("RoadmapEditor 異常系", () => {
  beforeEach(() => {
    mockedRoadmapApi.update.mockReset();
  });
  test("content を空にして保存すると必須エラーが出て update は呼ばれない", async () => {
    const roadmap = {
      id: 1,
      concernId: 1,
      goal: "もとのゴール",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    mockedRoadmapApi.update.mockResolvedValue({} as any);

    render(<RoadmapEditor concernId={1} roadmap={roadmap} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    // content を空にする
    fireEvent.change(contentInput, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    // 必須エラーが出る
    expect(await screen.findByText("ロードマップは必須です")).toBeInTheDocument();

    // update は呼ばれない
    expect(mockedRoadmapApi.update).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  test("content が1001文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const roadmap = {
      id: 1,
      concernId: 1,
      goal: "もとのゴール",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    render(<RoadmapEditor concernId={1} roadmap={roadmap} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    const longText = "a".repeat(1001);
    fireEvent.change(contentInput, { target: { value: longText } });

    expect(screen.getByText("ロードマップは1000文字以内です")).toBeInTheDocument();

    // 超過中は保存が disabled（今回仕様）
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("goal が121文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const roadmap = {
      id: 1,
      concernId: 1,
      goal: "もとのゴール",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    render(<RoadmapEditor concernId={1} roadmap={roadmap} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [triggerInput] = inputs;

    const longText = "a".repeat(121);
    fireEvent.change(triggerInput, { target: { value: longText } });

    expect(screen.getByText("ゴールは120文字以内です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("更新が失敗したらエラーが表示され、編集モードのままで onSaved は呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const roadmap = {
      id: 1,
      concernId: 1,
      goal: "もとのゴール",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    mockedRoadmapApi.update.mockRejectedValueOnce(new Error("update failed"));

    render(<RoadmapEditor concernId={1} roadmap={roadmap} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;
    fireEvent.change(contentInput, { target: { value: "更新後の内容" } });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "更新に失敗しました。時間を置いて再度お試しください。"
    );

    expect(screen.getAllByRole("textbox")).toHaveLength(2);

    expect(onSaved).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "保存" })).toBeEnabled();
    });

    consoleSpy.mockRestore();
  });
});
