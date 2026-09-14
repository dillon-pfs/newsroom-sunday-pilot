"use client";

import { usePathname } from "next/navigation";
import { DEMO_BANNER } from "@/lib/demo/melbourne";

export function DemoBanner() {
  const pathname = usePathname();
  if (pathname?.startsWith("/review")) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 border-b border-demo-foreground/20 bg-demo text-demo-foreground">
      <p className="mx-auto max-w-5xl px-4 py-2 font-mono text-[11px] leading-4 tracking-[0.08em] uppercase sm:px-6 sm:text-xs sm:tracking-[0.12em]">
        {DEMO_BANNER}
      </p>
    </div>
  );
}
