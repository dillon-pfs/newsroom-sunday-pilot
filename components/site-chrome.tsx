import { BrandLockup, BrandMark } from "@/components/brand-lockup";
import { DemoBanner } from "@/components/demo-banner";
import { SiteNav } from "@/components/site-nav";
import Link from "next/link";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <DemoBanner />
      <header className="border-b border-border bg-paper">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <BrandLockup />
            <SiteNav />
          </div>
          <p className="max-w-3xl text-sm text-ink-soft">
            NFL scores and a satirical desk. Melbourne, SNF and MNF are labeled
            DEMO backtests. SIMULATED tape stays on the private review screen.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-3 font-mono text-[11px] tracking-wide text-ink-soft uppercase sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-2">
            <BrandMark size={16} />
            Poor Form Sports · Lead: Chip Absolute · DEMO: Melbourne · SNF · MNF
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/about" className="hover:text-masthead hover:underline">About satire</Link>
            <Link href="/mail" className="hover:text-masthead hover:underline">Mail the Desk</Link>
            <span>Public-live path never loads the SIMULATED reel.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
