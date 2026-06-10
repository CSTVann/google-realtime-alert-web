import { alertQueue, trendSignals } from "../data";

export function AlertFeed() {
  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
      <article className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">Signals</p>
            <h3 className="mt-1 text-xl font-semibold">Sample trend map</h3>
          </div>
          <span className="badge">Demo data</span>
        </div>

        <div className="mt-6 space-y-3">
          {trendSignals.map((signal) => (
            <div key={signal.topic} className="panel-strong p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{signal.topic}</p>
                  <p className="mt-0.5 text-sm text-muted">{signal.source}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">{signal.delta}</p>
                  <p className="text-muted">{signal.strength}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{signal.summary}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="panel p-6 sm:p-8">
        <p className="section-label">Alerts</p>
        <h3 className="mt-1 text-xl font-semibold">Priority events</h3>

        <div className="mt-6 space-y-3">
          {alertQueue.map((alert) => (
            <div key={alert.title} className="panel-strong p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-muted">
                <span>{alert.category}</span>
                <span>{alert.age}</span>
              </div>
              <p className="mt-2 font-medium">{alert.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{alert.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
                <span className="text-muted">Confidence</span>
                <span className="font-medium">{alert.confidence}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
