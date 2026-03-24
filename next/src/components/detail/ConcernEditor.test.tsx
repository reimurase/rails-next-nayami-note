// src/components/detail/ConcernEditor.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import ConcernEditor from "./ConcernEditor";

import { concernApi } from "@/lib/api/concern";

jest.mock("@/lib/api/concern", () => ({
  concernApi: {
    update: jest.fn(),
  },
}));

const mockedConcernApi = concernApi as jest.Mocked<typeof concernApi>;

describe("ConcernEditor", () => {
  beforeEach(() => {
    mockedConcernApi.update.mockReset();
  });

  test("編集して保存すると update と handleCreated が呼ばれる", async () => {
    mockedConcernApi.update.mockResolvedValue({} as any);
    const handleCreated = jest.fn();
    const handleCancelEdit = jest.fn();

    render(
      <ConcernEditor
        concern={{ id: 1, triggerEvent: "旧きっかけ", content: "旧内容", archivedAt: null }}
        onSaved={handleCreated}
        onCancel={handleCancelEdit}
      />
    );

    fireEvent.change(screen.getByDisplayValue("旧きっかけ"), {
      target: { value: "新きっかけ" },
    });
    fireEvent.change(screen.getByDisplayValue("旧内容"), {
      target: { value: "新内容" },
    });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(mockedConcernApi.update).toHaveBeenCalledWith(1, {
        triggerEvent: "新きっかけ",
        content: "新内容",
      });
    });

    await waitFor(() => {
      expect(handleCreated).toHaveBeenCalled();
    });
  });
});

describe("ConcernEditor 異常系", () => {
  beforeEach(() => {
    mockedConcernApi.update.mockReset();
  });
  test("content を空にして保存すると必須エラーが出て update は呼ばれない", async () => {
    const concern = {
      id: 1,
      triggerEvent: "もとのきっかけ",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    mockedConcernApi.update.mockResolvedValue({} as any);

    render(<ConcernEditor concern={concern} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    // content を空にする
    fireEvent.change(contentInput, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    // 必須エラーが出る
    expect(await screen.findByText("なやみは必須です")).toBeInTheDocument();

    // update は呼ばれない
    expect(mockedConcernApi.update).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  test("content が1001文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const concern = {
      id: 1,
      triggerEvent: "もとのきっかけ",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    render(<ConcernEditor concern={concern} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [, contentInput] = inputs;

    const longText = "a".repeat(1001);
    fireEvent.change(contentInput, { target: { value: longText } });

    expect(screen.getByText("なやみは1000文字以内です")).toBeInTheDocument();

    // 超過中は保存が disabled（今回仕様）
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("triggerEvent が121文字だと文字数エラーが出て保存ボタンが押せない", () => {
    const concern = {
      id: 1,
      triggerEvent: "もとのきっかけ",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    render(<ConcernEditor concern={concern} onSaved={onSaved} onCancel={onCancel} />);

    const inputs = screen.getAllByRole("textbox");
    const [triggerInput] = inputs;

    const longText = "a".repeat(121);
    fireEvent.change(triggerInput, { target: { value: longText } });

    expect(screen.getByText("きっかけは120文字以内です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
  });

  test("更新が失敗したらエラーが表示され、編集モードのままで onSaved は呼ばれない", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const concern = {
      id: 1,
      triggerEvent: "もとのきっかけ",
      content: "もとの内容",
      archivedAt: null,
    };
    const onSaved = jest.fn();
    const onCancel = jest.fn();

    mockedConcernApi.update.mockRejectedValueOnce(new Error("update failed"));

    render(<ConcernEditor concern={concern} onSaved={onSaved} onCancel={onCancel} />);

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
