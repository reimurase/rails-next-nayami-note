// src/components/detail/ConcernSection.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";

import ConcernSection from "./ConcernSection";

describe("ConcernSection", () => {
  test("編集を押すと編集モードに切り替わる", () => {
    render(
      <ConcernSection
        concernId={1}
        concern={{ id: 10, triggerEvent: "旧きっかけ", content: "旧内容" }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByDisplayValue("旧きっかけ")).toBeInTheDocument();
    expect(screen.getByDisplayValue("旧内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });
});
