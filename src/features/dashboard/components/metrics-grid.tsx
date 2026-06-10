import { overviewStats } from "../data";

export function MetricsGrid() {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {overviewStats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <p className="stat-label">{stat.label}</p>
          <p className="stat-value">{stat.value}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{stat.detail}</p>
        </article>
      ))}
    </section>
  );
}
