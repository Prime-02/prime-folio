// components/ui/ThemeProvider.tsx
"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/stores";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
