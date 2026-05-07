"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { authApi } from "@/lib/api/auth";
import { clearCsrfTokenCache } from "@/lib/api/csrf";
import { useSidebar } from "@/providers/SidebarProvider";

export function AppHeader() {
  const router = useRouter();
  const { data: me } = useSWR("me", null);
  const { toggle, close } = useSidebar();

  const isLoggedIn = !!me;

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
      close();
      mutate("me", undefined, false);
      router.replace("/");
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {isLoggedIn && (
            <IconButton edge="start" aria-label="メニューを開閉" onClick={toggle} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            なやみノート
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            {isLoggedIn ? (
              <Button onClick={onLogout} color="inherit">
                ログアウト
              </Button>
            ) : (
              <>
                <Button component={Link} href="/signup" color="inherit">
                  サインアップ
                </Button>
                <Button component={Link} href="/login" color="inherit">
                  ログイン
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
