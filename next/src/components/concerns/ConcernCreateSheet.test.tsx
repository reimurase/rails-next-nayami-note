// src/components/concerns/ConcernCreateSheet.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import ConcernCreateSheet from "./ConcernCreateSheet";

// ConcernForm をモック化して、onCreated が呼ばれるか確認できるようにする
jest.mock("./ConcernForm", () => {
  return function MockConcernForm(props: { onCreated: () => void }) {
    return (
      <div data-testid="concern-form" onClick={() => props.onCreated()}>
        ConcernFormMock
      </div>
    );
  };
});

describe("ConcernCreateSheet", () => {
  test("isOpen=false のときは何も表示しない", () => {
    render(<ConcernCreateSheet isOpen={false} onClose={jest.fn()} onCreated={jest.fn()} />);

    // 見出しが表示されていないことを確認
    expect(screen.queryByText("悩みを追加")).not.toBeInTheDocument();
  });

  test("isOpen=true のときは見出しとフォームが表示される", () => {
    render(<ConcernCreateSheet isOpen={true} onClose={jest.fn()} onCreated={jest.fn()} />);

    // 見出しが表示される
    expect(screen.getByText("悩みを追加")).toBeInTheDocument();
    // モック化した ConcernForm が表示される
    expect(screen.getByTestId("concern-form")).toBeInTheDocument();
  });

  test("✕ボタンを押したときに onClose が呼ばれる", () => {
    const handleClose = jest.fn();

    render(<ConcernCreateSheet isOpen={true} onClose={handleClose} onCreated={jest.fn()} />);

    const closeButton = screen.getByRole("button", { name: "✕" });

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("ConcernForm 内で onCreated が呼ばれたら、親から渡した onCreated も呼ばれる", () => {
    const handleCreated = jest.fn();

    render(<ConcernCreateSheet isOpen={true} onClose={jest.fn()} onCreated={handleCreated} />);

    // モック ConcernForm をクリックすると props.onCreated() が呼ばれるようにしてある
    const form = screen.getByTestId("concern-form");
    fireEvent.click(form);

    expect(handleCreated).toHaveBeenCalledTimes(1);
  });
});
