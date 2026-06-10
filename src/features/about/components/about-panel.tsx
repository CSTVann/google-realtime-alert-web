import Link from "next/link";

import { PageHeader } from "@/features/ui/page-header";

const values = [
  {
    title: "Simple setup",
    description:
      "Register, connect your Telegram bot and group, add keywords, and start tracking. No custom development or agency required.",
  },
  {
    title: "Transparent pricing",
    description:
      "Pay only for what you use. One credit equals one keyword track run. Plans include clear project limits and credit expiry windows.",
  },
  {
    title: "Real-time delivery",
    description:
      "Search results are sent directly to your Telegram group so your team sees alerts where they already work.",
  },
  {
    title: "Full control",
    description:
      "Manage projects, keywords, schedules, and date ranges from one dashboard. Pause, edit, or remove tracks anytime.",
  },
];

const steps = [
  "Create an account and receive 100 free credits to try the platform.",
  "Set up a project with your Telegram bot token and group ID.",
  "Add keywords with custom tracking windows and schedules.",
  "Run tracks manually or on a schedule — results arrive in Telegram instantly.",
];

export function AboutPanel() {
  return (
    <div className="page-stack">
      <section className="panel p-6 sm:p-8">
        <PageHeader
          label="About us"
          title="Built for teams who need Google alerts, not another agency"
          description="Trend Alert helps you monitor keywords across Google Search and deliver results to Telegram — without building custom bots or hiring developers."
        />
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Our mission</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          We built Trend Alert because tracking brand names, competitors, or topics online should
          not require a custom integration project. Whether you are a marketer, founder, or analyst,
          you deserve a straightforward tool: create a project, define what to watch, and receive
          structured alerts in the channel your team already uses.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {values.map((item) => (
          <article key={item.title} className="stat-card">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="text-xl font-semibold">How Trend Alert works</h2>
        <ol className="mt-6 space-y-4">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6 text-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-xs font-semibold text-[var(--foreground)]">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Why Telegram?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          Telegram is fast, free, and already used by teams worldwide. By connecting your own bot
          and group, you keep full ownership of notifications — Trend Alert simply delivers search
          results on your schedule. No new app to install, no inbox clutter.
        </p>
      </section>
    </div>
  );
}
