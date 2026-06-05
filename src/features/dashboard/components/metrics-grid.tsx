import { overviewStats } from "../data";

export function MetricsGrid() {
  return (
    <section id="overview" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {overviewStats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-[1.75rem] border border-white/75 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur"
        >
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{stat.detail}</p>
        </article>
      ))}
    </section>
  );
}