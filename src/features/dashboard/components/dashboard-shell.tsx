import type { ReactNode } from "react";

import { AuthNav } from "@/features/auth/components/auth-nav";

const navigationItems = ["Overview", "Signals", "Sources", "Alerts"];

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_40%),linear-gradient(180deg,_#f6f1e7_0%,_#efe7d8_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.85),_transparent_70%)] opacity-70" />
      <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/20">
            TA
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Realtime intelligence
            </p>
            <p className="text-lg font-semibold tracking-tight text-slate-950">
              Trend Alert API
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/80 px-2 py-1 shadow-sm shadow-slate-950/5 backdrop-blur md:flex">
          {navigationItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-950 hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        <AuthNav />
      </header>

      <main className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}