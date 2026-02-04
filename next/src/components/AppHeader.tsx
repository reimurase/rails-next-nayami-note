// src/components/AppHeader.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

import { authApi } from "@/lib/authApi";
import { clearCsrfTokenCache } from "@/lib/api";

export function AppHeader() {
  const router = useRouter();

  const onLogout = async () => {
    try {
      await authApi.logout();
      clearCsrfTokenCache();
    } catch (e: any) {
      const status = e?.response?.status;
      if (status !== 401) {
        alert("Logout failed (non-401). Check Network/Console.");
        console.error(e);
      }
    } finally {
      mutate("me", undefined, false);
      router.replace("/");
    }
  };

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <Link href="/">なやみノート</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        <Link href="/login">Login</Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
