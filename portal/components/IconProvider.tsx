"use client";

import { IconContext } from "@phosphor-icons/react";

/** Soft light weight — reads more premium than Lucide’s default stroke. */
export function IconProvider({ children }: { children: React.ReactNode }) {
  return (
    <IconContext.Provider value={{ weight: "light", mirrored: false }}>
      {children}
    </IconContext.Provider>
  );
}
