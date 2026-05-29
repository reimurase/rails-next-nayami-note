"use client";

import useSWR from "swr";
import { type ReactNode } from "react";
import Alert from "@mui/material/Alert";

import { normalizeApiError } from "@/lib/api/error";
import { authApi } from "@/lib/api/auth";

type Props = {
  children: ReactNode;
};

export function AuthGuard({ children }: Props) {
  const { data, error, isLoading } = useSWR("me", () => authApi.me(), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // /me確認中 or 401でリダイレクト中は何も出さない
  if (isLoading) return null;
  // 外部がmutateを更新して、キャッシュ情報をクリアにした場合
  if (!data && !error) return null;

  if (error) {
    const appError = normalizeApiError(error);

    if (appError.type === "unauthorized") return null;

    return (
      <Alert severity="error">
        セッションの読み込みに失敗しました。ページを再度更新してください。
      </Alert>
    );
  }

  return <>{children}</>;
}
