// src/lib/api/error.test.ts

import { normalizeApiError } from "./error";

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  isAxiosError: (error: any) => error?.isAxiosError === true,
}));

describe("normalizeApiError", () => {
  test("Axiosエラーでないときunknownを返す", () => {
    expect(normalizeApiError(new Error("unexpected"))).toMatchObject({ type: "unknown" });
  });

  test("responseがないときnetworkを返す", () => {
    const error = { isAxiosError: true, response: undefined };
    expect(normalizeApiError(error)).toMatchObject({ type: "network" });
  });

  test("401はunauthorizedを返す", () => {
    const error = { isAxiosError: true, response: { status: 401, data: {} } };
    expect(normalizeApiError(error)).toMatchObject({ type: "unauthorized", status: 401 });
  });

  test("403はforbiddenを返す", () => {
    const error = { isAxiosError: true, response: { status: 403, data: {} } };
    expect(normalizeApiError(error)).toMatchObject({ type: "forbidden", status: 403 });
  });

  test("404はnot_foundを返す", () => {
    const error = { isAxiosError: true, response: { status: 404, data: {} } };
    expect(normalizeApiError(error)).toMatchObject({ type: "not_found", status: 404 });
  });

  test("422はvalidationを返しerrorsを含む", () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 422,
        data: { errors: { password: [{ code: "too_short" }] } },
      },
    };
    expect(normalizeApiError(error)).toMatchObject({
      type: "validation",
      status: 422,
      errors: { password: [{ code: "too_short" }] },
    });
  });

  test("422でerror.code=invalid_tokenのときtoken_errorを返す", () => {
    const error = {
      isAxiosError: true,
      response: { status: 422, data: { error: { code: "invalid_token" } } },
    };
    expect(normalizeApiError(error)).toMatchObject({ type: "token_error", code: "invalid_token" });
  });

  test("422でerror.code=token_expiredのときtoken_errorを返す", () => {
    const error = {
      isAxiosError: true,
      response: { status: 422, data: { error: { code: "token_expired" } } },
    };
    expect(normalizeApiError(error)).toMatchObject({ type: "token_error", code: "token_expired" });
  });

  test("429はrate_limitedを返し、メッセージを含む", () => {
    const error = { isAxiosError: true, response: { status: 429, data: {} } };
    const result = normalizeApiError(error);

    expect(result).toMatchObject({ type: "rate_limited", status: 429 });
    expect((result as { message: string }).message).toBeTruthy();
  });

  test("該当しないステータスはunknownを返す", () => {
    const error = { isAxiosError: true, response: { status: 500, data: {} } };

    expect(normalizeApiError(error)).toMatchObject({
      type: "unknown",
      status: 500,
      message: expect.any(String),
    });
  });
});
