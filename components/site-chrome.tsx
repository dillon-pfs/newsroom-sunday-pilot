import Link from "next/link";

const nav = [
  { href: "/", label: "Scoreboard" },
  { href: "/bloggers/lead-blogger", label: "Lead Blogger" },
  { href: "/review", label: "Desk review" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-ink/15 bg-paper">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] text-masthead uppercase">
                Sunday desk · Pilot
              </p>
              <Link
                href="/"
                className="font-heading text-4xl leading-none font-semibold tracking-tight text-ink sm:text-5xl"
              >
                Newsroom
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
          <p className="max-w-2xl text-sm text-ink/70">
            Satirical fantasy-football desk. Public pages carry official stubs
            only. Simulated tape stays on the private review screen.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-ink/15">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-4 font-mono text-[11px] tracking-wide text-ink/55 uppercase sm:px-6">
          <p>Temp brand: Newsroom · Blogger: Lead Blogger · Game: Sunday Pilot Game</p>
          <p>Public-live path never loads the simulated reel.</p>
        </div>
      </footer>
    </div>
  );
}
