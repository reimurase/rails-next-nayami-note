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
  Typography,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useSWR from "swr";
import { useRouter, usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

import { useSidebar } from "@/providers/SidebarProvider";
import { concernApi } from "@/lib/api/concern";
import ConcernDetailView from "@/components/detail/ConcernDetailView";

export const SIDEBAR_WIDTH = 240;

type Mode = "note" | "library";

const RECENT_CONCERNS_LIMIT = 5;

const NAV_ITEMS: Record<Mode, { label: string; path: string; icon: ReactNode }[]> = {
  note: [
    { label: "なやみを書く", path: "/concerns/new", icon: <AddIcon /> },
    { label: "なやみ", path: "/concerns", icon: <EditNoteIcon /> },
    { label: "問題", path: "/issues", icon: <ReportProblemIcon /> },
    { label: "ロードマップ", path: "/roadmaps", icon: <MapIcon /> },
  ],
  library: [
    { label: "なやみを書く", path: "/concerns/new", icon: <AddIcon /> },
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

  const {
    data: concerns,
    isLoading: loading,
    mutate,
  } = useSWR(open ? "/api/v1/concerns" : null, () => concernApi.getConcerns());

  const recentConcerns = concerns?.slice(0, RECENT_CONCERNS_LIMIT) ?? [];

  const [selectedConcernId, setSelectedConcernId] = useState<number | null>(null);

  const handleModeChange = (_: React.MouseEvent, newMode: Mode | null) => {
    if (!newMode) return;
    const dest = newMode === "library" ? "/library/concerns" : "/concerns";
    router.push(dest);
  };

  const items = NAV_ITEMS[mode];

  return (
    <>
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

          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              最近のなやみ
            </Typography>
          </Box>

          <List disablePadding dense>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : recentConcerns.length === 0 ? null : (
              recentConcerns.map((concern) => (
                <ListItem key={concern.id} disablePadding>
                  <ListItemButton
                    selected={selectedConcernId === concern.id}
                    onClick={() => setSelectedConcernId(concern.id)}
                  >
                    <ListItemText
                      primary={concern.content}
                      slotProps={{ primary: { noWrap: true, variant: "body2" } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Drawer>

      <Dialog
        open={selectedConcernId !== null}
        onClose={() => setSelectedConcernId(null)}
        fullWidth
      >
        <DialogContent>
          {selectedConcernId !== null && (
            <ConcernDetailView
              concernId={selectedConcernId}
              onConcernListChanged={() => {
                mutate();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
