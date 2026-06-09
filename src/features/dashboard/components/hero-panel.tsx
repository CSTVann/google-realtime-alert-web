import Link from "next/link";

import { sourceMix } from "../data";

export function HeroPanel() {
  return (
    <section id="overview" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="panel space-y-6 rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          Keyword signal ops
        </span>

        <div className="space-y-4">
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Track anything on Google. Deliver alerts to Telegram.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            No agency. No freelance bot builder. Register, buy a plan, create projects, set
            keywords and schedules, and get results in your Telegram chat or group. 100 free credits
            on signup.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/projects" className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold">
            Create a project
          </Link>
          <Link href="/pricing" className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold">
            View pricing
          </Link>
        </div>
      </div>

      <aside className="panel-strong space-y-4 rounded-[2rem] bg-[var(--accent)] p-6 text-[var(--accent-fg)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] opacity-80">Live console</p>
            <h3 className="mt-2 text-2xl font-semibold">Signal queue</h3>
          </div>
          <span className="rounded-full border border-current/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em]">
            Online
          </span>
        </div>

        <div className="space-y-3">
          {sourceMix.map((source) => (
            <div key={source.name} className="rounded-2xl border border-current/15 bg-black/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{source.name}</p>
                <p className="font-mono text-sm">{source.percentage}</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-current"
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
