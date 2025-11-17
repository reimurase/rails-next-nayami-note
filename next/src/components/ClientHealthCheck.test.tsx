import { render, screen } from "@testing-library/react";
import useSWR from "swr";

import ClientHealthCheck from "./ClientHealthCheck";

jest.mock("swr");

const mockedUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

describe("ClientHealthCheck", () => {
  it("ヘルスチェック用の文言が表示されること", async () => {
    mockedUseSWR.mockReturnValue({
      data: { message: "Success Health Check!" },
      error: null,

      isLoading: false,
      mutate: jest.fn(),
    } as any);

    render(<ClientHealthCheck />);

    // とりあえず lint が動くかの確認用
    expect(await screen.findByText("Client fetch: Success Health Check!")).toBeInTheDocument();
  });
});
