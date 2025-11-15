import { render, screen } from "@testing-library/react";

function Hello() {
  return <h1>Hello Jest!</h1>;
}

describe("Hello component", () => {
  it("renders text", () => {
    render(<Hello />);
    expect(screen.getByText("Hello Jest!")).toBeInTheDocument();
  });
});
