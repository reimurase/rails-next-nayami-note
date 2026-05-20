"use client";

import useSWR from "swr";
import axios from "axios";
import { type ReactNode } from "react";

import { authApi } from "@/lib/api/auth";

type Props = {
  children: ReactNode;
};

function isUnauthorized(err: unknown): boolean {
  return axios.isAxiosError(err) && err.response?.status === 401;
}

export function AuthGuard({ children }: Props) {
  const { error, isLoading } = useSWR("me", () => authApi.me(), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // /me確認中 or 401でリダイレクト中は何も出さない
  if (isLoading) return null;
  if (isUnauthorized(error)) return null;

  // 401以外のエラーは「表示する」
  if (error) {
    return <div style={{ padding: 16 }}>Failed to load session.</div>;
  }

  return <>{children}</>;
}
