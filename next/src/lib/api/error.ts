// src/lib/api/error.ts
import axios from "axios";

export type ApiFieldError = {
  code: string;
  meta?: Record<string, unknown>;
};

export type AppApiError =
  | { type: "validation"; status: 422; errors: Record<string, ApiFieldError[]> }
  | { type: "unauthorized"; status: 401; message: string }
  | { type: "forbidden"; status: 403; message: string }
  | { type: "not_found"; status: 404; message: string }
  | { type: "rate_limited"; status: 429; message: string }
  | { type: "network"; message: string }
  | { type: "unknown"; status?: number; message: string };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const isApiFieldError = (v: unknown): v is ApiFieldError =>
  isRecord(v) && typeof v.code === "string";

const isValidationErrors = (v: unknown): v is Record<string, ApiFieldError[]> => {
  if (!isRecord(v)) return false;

  return Object.values(v).every((arr) => Array.isArray(arr) && arr.every(isApiFieldError));
};

export function normalizeApiError(error: unknown): AppApiError {
  if (!axios.isAxiosError(error)) {
    return { type: "unknown", message: "予期しないエラーが発生しました" };
  }

  if (!error.response) {
    return { type: "network", message: "通信に失敗しました" };
  }

  const { status, data } = error.response;

  if (status === 422 && isRecord(data) && isValidationErrors(data.errors)) {
    return {
      type: "validation",
      status: 422,
      errors: data.errors,
    };
  }

  if (status === 401) {
    return { type: "unauthorized", status: 401, message: "認証が必要です" };
  }

  if (status === 403) {
    return { type: "forbidden", status: 403, message: "操作する権限がありません" };
  }

  if (status === 404) {
    return { type: "not_found", status: 404, message: "対象が見つかりません" };
  }

  if (status === 429) {
    return {
      type: "rate_limited",
      status: 429,
      message: "しばらく待ってから再試行してください",
    };
  }

  return {
    type: "unknown",
    status,
    message: "エラーが発生しました",
  };
}
