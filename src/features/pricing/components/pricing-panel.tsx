"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/auth-provider";
import { checkoutPlan, fetchPlans, type Plan } from "@/lib/api";

function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function PricingPanel() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void fetchPlans()
      .then(setPlans)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load plans"))
      .finally(() => setIsLoadingPlans(false));
  }, []);

  async function handleCheckout(planId: string) {
    if (!user) {
      window.location.href = "/register";
      return;
    }

    setLoadingPlan(planId);
    setError(null);
    setSuccess(null);

    try {
      const result = await checkoutPlan(planId);
      setSuccess(
        `${result.message} +${formatCredits(result.credits_added)} credits (balance: ${formatCredits(result.credits_balance)}).`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-8">
      <section className="panel rounded-[2rem] p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-muted">
          Pricing
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Track the internet on your schedule
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted">
          No agency. No custom bot. Register, buy a plan, create projects, link Telegram, and
          track keywords across Google results. Each track uses 1 credit per keyword run. New
          accounts get 100 free credits.
        </p>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {isLoadingPlans
          ? Array.from({ length: 3 }, (_, index) => (
              <article key={index} className="panel rounded-[2rem] p-6">
                <div className="mb-4 h-7 w-24 animate-pulse rounded-full bg-[var(--border)]" />
                <div className="h-8 w-32 animate-pulse rounded-full bg-[var(--border)]" />
                <div className="mt-2 h-4 w-full animate-pulse rounded-full bg-[var(--border)]" />
                <div className="mt-6 h-10 w-28 animate-pulse rounded-full bg-[var(--border)]" />
                <div className="mt-6 space-y-3">
                  {Array.from({ length: 4 }, (_, line) => (
                    <div key={line} className="h-4 w-3/4 animate-pulse rounded-full bg-[var(--border)]" />
                  ))}
                </div>
                <div className="mt-8 h-11 w-full animate-pulse rounded-2xl bg-[var(--border)]" />
              </article>
            ))
          : null}
        {!isLoadingPlans
          ? plans.map((plan) => (
          <article
            key={plan.id}
            className={`panel rounded-[2rem] p-6 ${
              plan.is_popular ? "ring-2 ring-[var(--accent)]" : ""
            }`}
          >
            {plan.is_popular ? (
              <span className="mb-4 inline-flex rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-fg)]">
                Most popular
              </span>
            ) : (
              <span className="mb-4 inline-flex h-7" />
            )}

            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className="mt-2 text-sm text-muted">{plan.description}</p>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-semibold">{formatPrice(plan.price_usd)}</span>
              <span className="pb-1 text-sm text-muted">/ pack</span>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              <li>{formatCredits(plan.credits)} credits</li>
              <li>
                {plan.max_projects === null
                  ? "Unlimited projects"
                  : `Up to ${plan.max_projects} projects`}
              </li>
              <li>1 credit = 1 keyword track run</li>
              <li>Telegram bot / group delivery</li>
            </ul>

            <button
              type="button"
              disabled={loadingPlan === plan.id}
              onClick={() => void handleCheckout(plan.id)}
              className="btn-primary mt-8 w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPlan === plan.id ? "Activating..." : user ? "Buy plan (stub)" : "Register to buy"}
            </button>
          </article>
            ))
          : null}
      </div>
    </div>
  );
}
