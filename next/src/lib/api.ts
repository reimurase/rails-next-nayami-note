import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { notifyUnauthorized } from "@/lib/onUnauthorized";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://localhost:3000";

// CSRFトークン取得エンドポイント
const CSRF_ENDPOINT = "/api/v1/csrf";

// JSONのキー名に合わせる
type CsrfResponse = { csrfToken: string };

// ---- Axios config拡張（内部フラグ用）----
declare module "axios" {
  export interface AxiosRequestConfig {
    skipCsrf?: boolean; // CSRF取得リクエスト自体にCSRF付与を走らせない
    retryOnCsrfFailure?: boolean; // 1回だけリトライするためのフラグ
  }
}

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Cookie を送る
});

// ---- CSRF token cache（メモリ）----
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

async function fetchCsrfToken(): Promise<string> {
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

function isMutatingMethod(method?: string) {
  const m = (method ?? "get").toLowerCase();
  return m === "post" || m === "put" || m === "patch" || m === "delete";
}

function isCsrfLikelyError(error: AxiosError) {
  const status = error.response?.status;
  // Railsの構成によって 403/422 あたりで落ちることが多いので広めに拾う
  return status === 403 || status === 422;
}

export function clearCsrfTokenCache() {
  csrfToken = null;
  csrfTokenPromise = null;
}

// ---- request interceptor：更新系だけCSRFヘッダ付与 ----
api.interceptors.request.use(async (config) => {
  if (config.skipCsrf) return config;
  if (!isMutatingMethod(config.method)) return config;

  const token = await fetchCsrfToken();
  config.headers = config.headers ?? {};
  config.headers["X-CSRF-Token"] = token;

  return config;
});

// ---- response interceptor：CSRFっぽい失敗なら1回だけ取り直してリトライ ----
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    const config = err.config as AxiosRequestConfig | undefined;
    if (!config) throw err;

    // CSRF取得リクエスト自体は対象外（無限ループ防止）
    if (config.skipCsrf) throw err;

    const status = err.response?.status;

    // 401 は共通で扱える形に変換（「土台」）
    if (status === 401) {
      notifyUnauthorized();
      throw err;
    }

    // CSRF失敗っぽい & まだリトライしてないなら、トークン破棄して1回だけ再実行
    if (isCsrfLikelyError(err) && !config.retryOnCsrfFailure) {
      clearCsrfTokenCache();
      config.retryOnCsrfFailure = true;

      const token = await fetchCsrfToken();
      config.headers = config.headers ?? {};
      config.headers["X-CSRF-Token"] = token;

      return api.request(config);
    }

    throw err;
  }
);
