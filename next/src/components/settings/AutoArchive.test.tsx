// src/components/settings/AutoArchive.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import AutoArchiveSetting from "./AutoArchiveSetting";

import { authApi } from "@/lib/api/auth";

jest.mock("@/lib/api/auth", () => ({
  authApi: {
    updateAutoArchive: jest.fn(),
  },
}));

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

describe("AutoArchiveSetting", () => {
  beforeEach(() => {
    mockedAuthApi.updateAutoArchive.mockReset();
  });

  test("ONのときOFF更新APIを呼ぶ", async () => {
    mockedAuthApi.updateAutoArchive.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      autoArchiveEnabled: false,
    });

    const handleUpdate = jest.fn();

    render(<AutoArchiveSetting enabled={true} onUpdated={handleUpdate} />);

    fireEvent.click(screen.getByRole("button", { name: "OFFにする" }));

    await waitFor(() => {
      expect(mockedAuthApi.updateAutoArchive).toHaveBeenCalledWith(false);
    });

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    });
  });

  test("OFFのときON更新APIを呼ぶ", async () => {
    mockedAuthApi.updateAutoArchive.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      autoArchiveEnabled: true,
    });

    const handleUpdate = jest.fn();

    render(<AutoArchiveSetting enabled={false} onUpdated={handleUpdate} />);

    fireEvent.click(screen.getByRole("button", { name: "ONにする" }));

    await waitFor(() => {
      expect(mockedAuthApi.updateAutoArchive).toHaveBeenCalledWith(true);
    });

    await waitFor(() => {
      expect(handleUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
