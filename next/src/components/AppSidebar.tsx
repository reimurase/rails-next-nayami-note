// src/components/AppSidebar.tsx
"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MapIcon from "@mui/icons-material/Map";
import { useRouter, usePathname } from "next/navigation";
import { type ReactNode } from "react";

import { useSidebar } from "@/providers/SidebarProvider";

export const SIDEBAR_WIDTH = 240;

type Mode = "note" | "library";

const NAV_ITEMS: Record<Mode, { label: string; path: string; icon: ReactNode }[]> = {
  note: [
    { label: "なやみ", path: "/concerns", icon: <EditNoteIcon /> },
    { label: "問題", path: "/issues", icon: <ReportProblemIcon /> },
    { label: "ロードマップ", path: "/roadmaps", icon: <MapIcon /> },
  ],
  library: [
    { label: "なやみ", path: "/library/concerns", icon: <EditNoteIcon /> },
    { label: "問題", path: "/library/issues", icon: <ReportProblemIcon /> },
    { label: "ロードマップ", path: "/library/roadmaps", icon: <MapIcon /> },
  ],
};

function resolveMode(pathname: string): Mode {
  return pathname.startsWith("/library") ? "library" : "note";
}

export function AppSidebar() {
  const { open } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const mode = resolveMode(pathname);

  const handleModeChange = (_: React.MouseEvent, newMode: Mode | null) => {
    if (!newMode) return;
    // モード切替時に対応するconcernsページへ遷移
    const dest = newMode === "library" ? "/library/concerns" : "/concerns";
    router.push(dest);
  };

  const items = NAV_ITEMS[mode];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          top: "auto",
        },
      }}
    >
      <Box>
        <Box sx={{ px: 2, py: 2, display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            size="small"
            fullWidth
          >
            <ToggleButton value="note">ノート</ToggleButton>
            <ToggleButton value="library">ライブラリ</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider />

        <List disablePadding>
          {items.map(({ label, path, icon }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton selected={pathname === path} onClick={() => router.push(path)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
