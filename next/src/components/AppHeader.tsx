// src/components/AppHeader.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

import { authApi } from "@/lib/authApi";

export function AppHeader() {
  const router = useRouter();

  const { data, isLoading, error } = useSWR("me", async () => (await authApi.me()).data, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const loggedIn = !isLoading && !error && !!data;

  const onLogout = async () => {
    await authApi.logout();
    mutate("me"); // ログイン状態を即更新
    router.replace("/"); // 画面も移動
  };

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <Link href="/">なやみノート</Link>

      <div style={{ marginLeft: "auto" }}>
        {loggedIn ? <button onClick={onLogout}>Logout</button> : <Link href="/login">Login</Link>}
      </div>
    </header>
  );
}
