"use client";

import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "@/styles/theme";

export default function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
