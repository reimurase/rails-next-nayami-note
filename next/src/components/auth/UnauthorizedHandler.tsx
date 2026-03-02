"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { mutate } from "swr";

import { setOnUnauthorized } from "@/lib/api/onUnauthorized";

export function UnauthorizedHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const running = useRef(false);

  useEffect(() => {
    setOnUnauthorized(() => {
      if (running.current) return;
      running.current = true;

      mutate("me", undefined, false);

      const next = pathname && pathname !== "/login" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);

      setTimeout(() => (running.current = false), 300);
    });

    return () => setOnUnauthorized(null);
  }, [router, pathname]);

  return null;
}
