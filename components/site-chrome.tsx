import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";

const nav = [
  { href: "/", label: "Board" },
  { href: "/demo", label: "DEMO" },
  { href: "/cast", label: "Cast" },
  { href: "/cast/chip-absolute", label: "Chip Absolute" },
  { href: "/review", label: "Desk review" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <DemoBanner />
      <header className="border-b border-ink/15 bg-paper">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] text-masthead uppercase">
                Poor Form Desk · Sunday pilot
              </p>
              <Link
                href="/"
                className="font-heading text-3xl leading-none font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Poor Form Sports
              </Link>
            </div>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-wide uppercase">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink/70 underline-offset-4 hover:text-masthead hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="max-w-3xl text-sm text-ink/70">
            Satirical desk. Public DEMO is Melbourne SF 27–LAR 7, labeled, not
            live. SIMULATED tape stays on the private review screen.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-ink/15">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-3 font-mono text-[11px] tracking-wide text-ink/55 uppercase sm:px-6">
          <p>Poor Form Sports · Lead: Chip Absolute · DEMO: SF 27–LAR 7 Melbourne</p>
          <p>Public-live path never loads the SIMULATED reel.</p>
        </div>
      </footer>
    </div>
  );
}
