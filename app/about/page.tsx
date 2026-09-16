import Link from "next/link";
import { DeskPill } from "@/components/desk-pill";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <section className="space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">Poor Form Sports</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">The desk rules</h1>
        <p className="text-base leading-7 text-ink-soft">
          Give the fan a job: celebrate, mock a rival, argue the math, show they got the reference, or cope with receipts.
        </p>
      </section>
      <section className="space-y-3 border border-border bg-card-loud p-4">
        <div className="flex flex-wrap gap-2"><DeskPill tone="demo">DEMO</DeskPill><DeskPill tone="satire">SATIRE</DeskPill></div>
        <p className="text-sm leading-6 text-ink">
          DEMO games are editorial backtests and are never live NFL scores. SATIRE lines are opinion and comedy, never reporting or breaking news. Official facts stay separate and labeled.
        </p>
        <p className="text-sm leading-6 text-ink-soft">
          The private SIMULATED reel stays off the public board. See a line that missed? <Link href="/mail" className="text-masthead underline-offset-4 hover:underline">Mail the Desk.</Link>
        </p>
      </section>
    </div>
  );
}
