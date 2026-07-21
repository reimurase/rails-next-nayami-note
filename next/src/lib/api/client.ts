import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { fetchCsrfToken, isMutatingMethod, isCsrfError, clearCsrfTokenCache } from "./csrf";

import { notifyUnauthorized } from "@/lib/api/onUnauthorized";

const baseURL = "";

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
    if (isCsrfError(err) && !config.retryOnCsrfFailure) {
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
