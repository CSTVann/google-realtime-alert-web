import Link from "next/link";

import { sourceMix } from "../data";

export function HeroPanel() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
      <div className="panel flex flex-col justify-center gap-6 p-8 lg:p-10">
        <span className="badge w-fit">Keyword tracking</span>

        <div className="space-y-3">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Track Google results. Get alerts in Telegram.
          </h2>
          <p className="max-w-xl text-base leading-7 text-muted">
            Create projects, add keywords with custom date ranges, and receive search results
            directly in your Telegram group. 100 free credits on signup.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/projects" className="btn-primary px-5 py-2.5">
            Create a project
          </Link>
          <Link href="/pricing" className="btn-secondary px-5 py-2.5">
            View pricing
          </Link>
        </div>
      </div>

      <aside className="panel flex flex-col gap-5 p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label">Overview</p>
            <h3 className="mt-1 text-xl font-semibold">How it works</h3>
          </div>
          <span className="badge badge-success">Live</span>
        </div>

        <ol className="space-y-3 text-sm leading-6 text-muted">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-[var(--foreground)]">
              1
            </span>
            Register and receive 100 trial credits
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-[var(--foreground)]">
              2
            </span>
            Connect a Telegram bot and group to your project
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-[var(--foreground)]">
              3
            </span>
            Add keywords and run tracks — 1 credit per keyword per run
          </li>
        </ol>

        <div className="mt-auto space-y-2 border-t border-[var(--border)] pt-5">
          <p className="section-label">Result sources</p>
          {sourceMix.map((source) => (
            <div key={source.name} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{source.name}</span>
                <span className="text-muted">{source.percentage}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: source.percentage }}
                />
              </div>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
