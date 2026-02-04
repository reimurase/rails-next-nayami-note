// src/lib/csrf.test.ts

import { api } from "./api";
import { fetchCsrfToken, clearCsrfTokenCache } from "./csrf";

jest.mock("./api", () => ({
  api: { get: jest.fn() },
}));

const apiGetMock = api.get as unknown as jest.Mock;

describe("csrf cache", () => {
  beforeEach(() => {
    clearCsrfTokenCache();
    apiGetMock.mockReset();
  });

  test("clearCsrfTokenCache後、Tokenが再取得できる", async () => {
    apiGetMock.mockResolvedValueOnce({ data: { csrfToken: "t1" } });
    apiGetMock.mockResolvedValueOnce({ data: { csrfToken: "t2" } });

    const t1 = await fetchCsrfToken();
    clearCsrfTokenCache();
    const t2 = await fetchCsrfToken();

    expect(t1).toBe("t1");
    expect(t2).toBe("t2");
    expect(apiGetMock).toHaveBeenCalledTimes(2);
  });
});
