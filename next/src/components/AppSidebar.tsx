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
  Typography,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MapIcon from "@mui/icons-material/Map";
import { useRouter, usePathname } from "next/navigation";

import { useSidebar } from "@/providers/SidebarProvider";

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: "なやみ", path: "/concerns", icon: <EditNoteIcon /> },
  { label: "問題", path: "/issues", icon: <ReportProblemIcon /> },
  { label: "ロードマップ", path: "/roadmaps", icon: <MapIcon /> },
] as const;

export function AppSidebar() {
  const { open } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

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
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            メニュー
          </Typography>
        </Box>

        <Divider />

        <List disablePadding>
          {NAV_ITEMS.map(({ label, path, icon }) => (
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
