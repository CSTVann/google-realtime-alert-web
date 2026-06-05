import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_40%),linear-gradient(180deg,_#f6f1e7_0%,_#efe7d8_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.85),_transparent_70%)] opacity-70" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
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
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-950 hover:text-white"
          >
            Back to dashboard
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
            <div className="mb-8 space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              <p className="text-sm text-slate-600">{subtitle}</p>
            </div>

            {children}

            <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
