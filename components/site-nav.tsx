"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isDemoGamePath } from "@/lib/demo/banners";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Board", match: (path: string) => path === "/" },
  {
    href: "/games/sunday-pilot",
    label: "Archive",
    match: (path: string) => isDemoGamePath(path),
  },
  {
    href: "/stories",
    label: "Stories",
    match: (path: string) => path.startsWith("/stories"),
  },
  {
    href: "/cast",
    label: "Cast",
    match: (path: string) => path === "/cast",
  },
  {
    href: "/mail",
    label: "Mail the Desk",
    match: (path: string) => path.startsWith("/mail"),
  },
  {
    href: "/cast/chip-absolute",
    label: "Chip Absolute",
    match: (path: string) => path.startsWith("/cast/chip-absolute"),
  },
];

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-wide uppercase">
      {nav.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "underline-offset-4",
              active
                ? "font-medium text-masthead"
                : "text-ink-soft hover:text-masthead hover:underline",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
