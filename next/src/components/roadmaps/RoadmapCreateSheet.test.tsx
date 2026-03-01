// src/components/roadmaps/RoadmapCreateSheet.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";

import RoadmapCreateSheet from "./RoadmapCreateSheet";

// RoadmapForm をモック化して、onCreated が呼ばれるか確認できるようにする
jest.mock("./RoadmapForm", () => {
  return function MockRoadmapForm(props: { onCreated: () => void }) {
    return (
      <div data-testid="roadmap-form" onClick={() => props.onCreated()}>
        RoadmapFormMock
      </div>
    );
  };
});

describe("RoadmapCreateSheet", () => {
  test("isOpen=false のときは何も表示しない", () => {
    render(<RoadmapCreateSheet isOpen={false} onClose={jest.fn()} onCreated={jest.fn()} />);

    // 見出しが表示されていないことを確認
    expect(screen.queryByText("ロードマップを追加")).not.toBeInTheDocument();
  });

  test("isOpen=true のときは見出しとフォームが表示される", () => {
    render(<RoadmapCreateSheet isOpen={true} onClose={jest.fn()} onCreated={jest.fn()} />);

    // 見出しが表示される
    expect(screen.getByText("ロードマップを追加")).toBeInTheDocument();
    // モック化した RoadmapForm が表示される
    expect(screen.getByTestId("roadmap-form")).toBeInTheDocument();
  });

  test("✕ボタンを押したときに onClose が呼ばれる", () => {
    const handleClose = jest.fn();

    render(<RoadmapCreateSheet isOpen={true} onClose={handleClose} onCreated={jest.fn()} />);

    const closeButton = screen.getByRole("button", { name: "✕" });

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("RoadmapForm 内で onCreated が呼ばれたら、親から渡した onCreated も呼ばれる", () => {
    const handleCreated = jest.fn();

    render(<RoadmapCreateSheet isOpen={true} onClose={jest.fn()} onCreated={handleCreated} />);

    // モック RoadmapForm をクリックすると props.onCreated() が呼ばれるようにしてある
    const form = screen.getByTestId("roadmap-form");
    fireEvent.click(form);

    expect(handleCreated).toHaveBeenCalledTimes(1);
  });
});
