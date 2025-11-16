import { render, screen } from "@testing-library/react";

import ClientHealthCheck from "./ClientHealthCheck";

describe("ClientHealthCheck", () => {
  it("ヘルスチェック用の文言が表示されること", () => {
    render(<ClientHealthCheck />);

    // とりあえず lint が動くかの確認用
    expect(screen.getByText(/health/i)).toBeInTheDocument();
  });
});
