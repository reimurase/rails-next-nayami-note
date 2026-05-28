// src/lib/api/error.test.ts

import { normalizeApiError } from "./error";

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  isAxiosError: (error: any) => error?.isAxiosError === true,
}));

describe("normalizeApiError", () => {
  test("429はrate_limitedを返し、メッセージを含む", () => {
    const error = { isAxiosError: true, response: { status: 429, data: {} } };
    const result = normalizeApiError(error);

    expect(result).toMatchObject({ type: "rate_limited", status: 429 });
    expect((result as { message: string }).message).toBeTruthy();
  });
});
