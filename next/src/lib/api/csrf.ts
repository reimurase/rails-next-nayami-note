import { AxiosError } from "axios";

import { api } from "./client";

// CSRFトークン取得エンドポイント
const CSRF_ENDPOINT = "/api/v1/csrf";

// JSONのキー名に合わせる
type CsrfResponse = { csrfToken: string };
type ApiErrorBody = { error?: { code?: string } };

let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

export async function fetchCsrfToken(): Promise<string> {
  // SSRでこれが動くと事故りやすいので、基本はブラウザのみで動かす
  if (typeof window === "undefined") {
    throw new Error("CSRF token fetch should run in the browser.");
  }

  // 既にあれば即返す
  if (csrfToken) return csrfToken;

  // 取得中ならそれに乗る（多重取得防止）
  if (csrfTokenPromise) return csrfTokenPromise;

  csrfTokenPromise = (async () => {
    // ★CSRF取得は interceptor の影響を受けないように skipCsrf を付ける
    const res = await api.get<CsrfResponse>(CSRF_ENDPOINT, { skipCsrf: true });
    const token = res.data.csrfToken;
    if (!token) throw new Error("CSRF token is missing in response.");
    csrfToken = token;
    return token;
  })();

  try {
    return await csrfTokenPromise;
  } finally {
    csrfTokenPromise = null;
  }
}

export function isMutatingMethod(method?: string) {
  const m = (method ?? "get").toLowerCase();
  return m === "post" || m === "put" || m === "patch" || m === "delete";
}

export function isCsrfError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const e = error as AxiosError<ApiErrorBody>;
  const status = e.response?.status;

  const apiCode = e.response?.data?.error?.code;

  return status === 403 && apiCode === "invalid_csrf";
}

export function clearCsrfTokenCache() {
  csrfToken = null;
  csrfTokenPromise = null;
}
