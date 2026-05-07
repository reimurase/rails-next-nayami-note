"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarContextType = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  toggle: () => {},
  close: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  const close = () => setOpen(false);

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>{children}</SidebarContext.Provider>
  );
}
