"use client";

import useSWR from "swr";
import type { AxiosError } from "axios";

import { authApi } from "@/lib/authApi";

type Props = {
  children: React.ReactNode;
};

function isUnauthorized(err: unknown): boolean {
  const e = err as AxiosError | undefined;
  return !!e && typeof e === "object" && (e as any).response?.status === 401;
}

export function AuthGuard({ children }: Props) {
  const { error, isLoading } = useSWR("me", async () => (await authApi.me()).data, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // /me確認中 or 401でリダイレクト中は何も出さない（最小）
  if (isLoading) return null;
  if (isUnauthorized(error)) return null;

  // 401以外のエラーは「落とす」か「表示する」か好み（最小なら落とすでもOK）
  if (error) {
    return <div style={{ padding: 16 }}>Failed to load session.</div>;
  }

  return <>{children}</>;
}
