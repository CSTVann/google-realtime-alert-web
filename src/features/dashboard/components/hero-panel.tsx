import { sourceMix } from "../data";

export function HeroPanel() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="space-y-6 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-900">
          Live trend watch
        </span>

        <div className="space-y-4">
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            A feature-based web console for real-time trend alerts.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Monitor live signals, inspect source mix, and surface high-confidence anomalies without
            fighting the UI. This landing surface is structured to grow into separate features as
            the product expands.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#overview"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Explore overview
          </a>
          <a
            href="#alerts"
            className="inline-flex items-center justify-center rounded-full border border-slate-950/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-950/20 hover:bg-slate-50"
          >
            Review alert queue
          </a>
        </div>
      </div>

      <aside className="space-y-4 rounded-[2rem] border border-slate-950/10 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pulse now</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">12 active streams</p>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            +8% vs yesterday
          </span>
        </div>

        <div className="space-y-4">
          {sourceMix.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{item.name}</span>
                <span className="font-medium text-white">{item.percentage}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400"
                  style={{ width: item.percentage }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-4 text-sm text-slate-300 sm:grid-cols-3">
          <div>
            <p className="text-slate-500">Refresh</p>
            <p className="mt-1 font-semibold text-white">Every 30s</p>
          </div>
          <div>
            <p className="text-slate-500">Confidence</p>
            <p className="mt-1 font-semibold text-white">0.87 avg</p>
          </div>
          <div>
            <p className="text-slate-500">Latency</p>
            <p className="mt-1 font-semibold text-white">2.3s</p>
          </div>
        </div>
      </aside>
    </section>
  );
}