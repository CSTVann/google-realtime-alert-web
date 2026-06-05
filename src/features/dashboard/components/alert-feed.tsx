import { alertQueue, trendSignals } from "../data";

export function AlertFeed() {
  return (
    <section id="signals" className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <article className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Signals
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Live trend map
            </h3>
          </div>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
            Updated 2 minutes ago
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {trendSignals.map((signal) => (
            <div
              key={signal.topic}
              className="rounded-[1.5rem] border border-slate-950/10 bg-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-950">{signal.topic}</p>
                  <p className="mt-1 text-sm text-slate-500">{signal.source}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-950">{signal.delta}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    {signal.strength}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{signal.summary}</p>
            </div>
          ))}
        </div>
      </article>

      <article
        id="alerts"
        className="rounded-[2rem] border border-slate-950/10 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-8"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Alert queue
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Priority events
        </h3>

        <div className="mt-6 space-y-4">
          {alertQueue.map((alert) => (
            <div key={alert.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-slate-400">
                <span>{alert.category}</span>
                <span>{alert.age}</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-white">{alert.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{alert.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-300">
                <span>Confidence</span>
                <span className="font-semibold text-white">{alert.confidence}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}