"use client";

import { Box } from "@mui/material";
import { type ReactNode } from "react";

import { useSidebar } from "@/providers/SidebarProvider";
import { SIDEBAR_WIDTH } from "@/components/AppSidebar";

type Props = {
  children: ReactNode;
};

export function MainContent({ children }: Props) {
  const { open } = useSidebar();

  return (
    <Box
      component="main"
      sx={{
        transition: (theme) =>
          theme.transitions.create("margin-left", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        marginLeft: open ? `${SIDEBAR_WIDTH}px` : 0,
        p: 2,
      }}
    >
      {children}
    </Box>
  );
}
