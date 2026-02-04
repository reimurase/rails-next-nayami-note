import { AxiosError } from "axios";

import { api } from "./api";

// CSRFトークン取得エンドポイント
const CSRF_ENDPOINT = "/api/v1/csrf";

// JSONのキー名に合わせる
type CsrfResponse = { csrfToken: string };

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

export function isCsrfLikelyError(error: AxiosError) {
  const status = error.response?.status;
  // Railsの構成によって 403/422 あたりで落ちることが多いので広めに拾う
  return status === 403 || status === 422;
}

export function clearCsrfTokenCache() {
  csrfToken = null;
  csrfTokenPromise = null;
}
