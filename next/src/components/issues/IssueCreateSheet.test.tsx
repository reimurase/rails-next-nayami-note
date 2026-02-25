// src/components/issues/IssueCreateSheet.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import IssueCreateSheet from "./IssueCreateSheet";

// IssueForm をモック化して、onCreated が呼ばれるか確認できるようにする
jest.mock("./IssueForm", () => {
  return function MockIssueForm(props: { onCreated: () => void }) {
    return (
      <div data-testid="issue-form" onClick={() => props.onCreated()}>
        IssueFormMock
      </div>
    );
  };
});

describe("IssueCreateSheet", () => {
  test("isOpen=false のときは何も表示しない", () => {
    render(<IssueCreateSheet isOpen={false} onClose={jest.fn()} onCreated={jest.fn()} />);

    // 見出しが表示されていないことを確認
    expect(screen.queryByText("問題を追加")).not.toBeInTheDocument();
  });

  test("isOpen=true のときは見出しとフォームが表示される", () => {
    render(<IssueCreateSheet isOpen={true} onClose={jest.fn()} onCreated={jest.fn()} />);

    // 見出しが表示される
    expect(screen.getByText("問題を追加")).toBeInTheDocument();
    // モック化した IssueForm が表示される
    expect(screen.getByTestId("issue-form")).toBeInTheDocument();
  });

  test("✕ボタンを押したときに onClose が呼ばれる", () => {
    const handleClose = jest.fn();

    render(<IssueCreateSheet isOpen={true} onClose={handleClose} onCreated={jest.fn()} />);

    const closeButton = screen.getByRole("button", { name: "✕" });

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("IssueForm 内で onCreated が呼ばれたら、親から渡した onCreated も呼ばれる", () => {
    const handleCreated = jest.fn();

    render(<IssueCreateSheet isOpen={true} onClose={jest.fn()} onCreated={handleCreated} />);

    // モック IssueForm をクリックすると props.onCreated() が呼ばれるようにしてある
    const form = screen.getByTestId("issue-form");
    fireEvent.click(form);

    expect(handleCreated).toHaveBeenCalledTimes(1);
  });
});
