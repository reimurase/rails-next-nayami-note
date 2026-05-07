import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import MuiProvider from "@/providers/MuiProvider";
import { SidebarProvider } from "@/providers/SidebarProvider";
import { AppHeader } from "@/components/AppHeader";
import { MainContent } from "@/components/MainContent";
import { AppSidebar } from "@/components/AppSidebar";
import "./globals.css";
import { UnauthorizedHandler } from "@/components/auth/UnauthorizedHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nayami Note",
  description: "Rails + Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <MuiProvider>
            <SidebarProvider>
              <UnauthorizedHandler />
              <AppHeader />
              <AppSidebar />
              <MainContent>{children}</MainContent>
            </SidebarProvider>
          </MuiProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
